import { RootState } from "../store";

const profileAuthorship = (state: RootState) => state.account.userId === state.map.authorId;

export const rootSelectors = { profileAuthorship };
