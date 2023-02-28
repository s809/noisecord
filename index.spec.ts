import { use } from "chai";
import chaiAsPromised from "chai-as-promised";
import chaiSubset from "chai-subset";
import sinonChai from "sinon-chai";

use(sinonChai);
use(chaiAsPromised);
use(chaiSubset);
