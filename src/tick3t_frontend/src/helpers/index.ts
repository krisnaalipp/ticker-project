const ICP_TO_NAT_RATIO = 1000000000n; // 1 ICP = 1,000,000,000 Nat

// Convert Nat to ICP
export function natToICP(amount: bigint): number {
    return Number(amount) / Number(ICP_TO_NAT_RATIO);
}