export type Strategy = {
    name: string;
    params: {
        symbol: string;
        address: string;
        decimals: number;
    };
    network: string;
};
