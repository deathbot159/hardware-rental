export interface ILoader {
    visible: boolean;
}

export type LoaderType = {
    loaderSettings: ILoader;
    showLoader: (visible: boolean) => void;
}