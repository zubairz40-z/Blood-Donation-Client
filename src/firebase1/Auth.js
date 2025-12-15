import { getAuth } from "firebase/auth";
import { app } from "./firebase.init";

export const auth = getAuth(app);
