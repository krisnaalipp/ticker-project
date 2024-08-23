import Text "mo:base/Text";
import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Result "mo:base/Result";
import Time "mo:base/Time";
import Int "mo:base/Int";
import Array "mo:base/Array";
import UUID "mo:uuid/UUID";
import Source "mo:uuid/async/SourceV4";

actor {
  type EventTicket = {
    id : Text;
    owner : Principal;
    title : Text;
    description : Text;
    price : Nat;
    totalTicketSold : Nat;
    createdAt : Int;
    updatedAt : ?Int;
  };

  type TicketSold = {
    id : Text;
    owner : Principal;
    eventTicketId : Text;
    username : Text;
  };

  type EventTicketPayload = {
    title : Text;
    description : Text;
    price : Nat;
  };

  var eventTicketStorage : HashMap.HashMap<Text, EventTicket> = HashMap.HashMap(0, Text.equal, Text.hash);
  var ticketSoldStorage : HashMap.HashMap<Text, TicketSold> = HashMap.HashMap(1, Text.equal, Text.hash);
  var myTicketStorage : HashMap.HashMap<Principal, EventTicket> = HashMap.HashMap(2, Principal.equal, Principal.hash);
  var source = Source.Source();

  public query func getAllEventTickets() : async [EventTicket] {
    Iter.toArray(eventTicketStorage.vals());
  };

  public shared (msg) func createEventTicket(payload : EventTicketPayload) : async Result.Result<EventTicket, Text> {
    let newTicket : EventTicket = {
      id = UUID.toText(await source.new());
      owner = msg.caller;
      createdAt = Time.now();
      updatedAt = null;
      title = payload.title;
      description = payload.description;
      price = payload.price;
      totalTicketSold = 0;
    };
    eventTicketStorage.put(newTicket.id, newTicket);
    myTicketStorage.put(newTicket.owner, newTicket);
    #ok(newTicket);
  };

  public query func getEventTicketById(id : Text) : async Result.Result<EventTicket, Text> {
    switch (eventTicketStorage.get(id)) {
      case (?ticket) { #ok(ticket) };
      case (null) { #err("event ticket with id=" # id # " not found") };
    };
  };

  public query func getEventTicketsByOwner(owner : Text) : async [EventTicket] {
    // Convert the short format of the owner to Principal
    let principal = Principal.fromText(owner);

    // Collect all tickets into an array
    let allTickets = Iter.toArray(eventTicketStorage.vals());

    // Filter tickets by owner
    let ownedTickets = Array.filter<EventTicket>(
      allTickets,
      func(ticket : EventTicket) : Bool {
        ticket.owner == principal;
      },
    );

    return ownedTickets;
  };

  public shared (msg) func deleteEventTicket(id : Text) : async Result.Result<EventTicket, Text> {
    switch (eventTicketStorage.get(id)) {
      case (?ticket) {
        if (Principal.toText(ticket.owner) != Principal.toText(msg.caller)) {
          #err("Unauthorized caller");
        } else {
          ignore eventTicketStorage.remove(id);
          #ok(ticket);
        };
      };
      case (null) {
        #err("couldn't delete ticket with id=" # id # ". Profile not found.");
      };
    };
  };

  public query func getTicketSoldById(id : Text) : async Result.Result<TicketSold, Text> {
    switch (ticketSoldStorage.get(id)) {
      case (?ticket) { #ok(ticket) };
      case (null) { #err("ticket sold with id=" # id # " not found") };
    };
  };

  public shared (msg) func buyTicket(id : Text, username : Text, ownerTicket : Principal) : async Result.Result<TicketSold, Text> {
    let eventTicket = await getEventTicketById(id);
    switch (eventTicket) {
      case (#ok(ticket)) {
        let newTicket : TicketSold = {
          id = UUID.toText(await source.new());
          owner = ownerTicket;
          eventTicketId = ticket.id;
          username = username;
        };

        ticketSoldStorage.put(newTicket.id, newTicket);
        myTicketStorage.put(newTicket.owner, ticket);

        let updateEventTicket : EventTicket = {
          ticket with
          totalTicketSold = ticket.totalTicketSold + 1;
          updatedAt = ?Time.now();
        };
        eventTicketStorage.put(updateEventTicket.id, updateEventTicket);

        #ok(newTicket);
      };
      case (#err(err)) { #err(err) };
    };
  };

  public shared (msg) func resellTicket(id : Text, username : Text, newOwner : Principal) : async Result.Result<TicketSold, Text> {
    let ticketSold = await getTicketSoldById(id);
    let eventTicketResult = await getEventTicketById(id);

    switch (ticketSold) {
      case (#ok(ticketSold)) {
        switch (eventTicketResult) {
          case (#ok(ticket)) {
            if (Principal.toText(ticketSold.owner) != Principal.toText(msg.caller)) {
              #err("Unauthorized caller");
            } else {
              let newTicket : TicketSold = {
                id = ticketSold.id;
                owner = newOwner;
                eventTicketId = ticketSold.eventTicketId;
                username = username;
              };

              // Update the ticketSoldStorage
              ticketSoldStorage.put(newTicket.id, newTicket);

              // Update the myTicketStorage with new owner information
              let updatedTicket : EventTicket = {
                ticket with
                owner = newOwner;
                totalTicketSold = ticket.totalTicketSold + 1;
                updatedAt = ?Time.now();
              };
              myTicketStorage.put(newOwner, updatedTicket);

              #ok(newTicket);
            };
          };
          case (#err(err)) { #err(err) };
        };
      };
      case (#err(err)) { #err(err) };
    };
  };
};
