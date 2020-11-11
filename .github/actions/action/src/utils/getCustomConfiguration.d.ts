export declare type CustomConfig = {
    input?: string;
};
export declare const getCustomConfiguration: () => Promise<CustomConfig | void>;
