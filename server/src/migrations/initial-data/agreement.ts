import {AgreementsDAO} from "../../data-layer/models/agreements.dao";

const agreement = new AgreementsDAO();
agreement.version = 1;
agreement.agreementBody = "<p>Simple service, use as is!</p><p>Bon Appétit.</p>";

export {agreement};
