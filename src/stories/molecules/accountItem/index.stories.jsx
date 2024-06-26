import store from "libs/store";

import { Provider } from "react-redux";
import AccountItem from ".";

export default {
  component: AccountItem,
  title: "molecules/accountItem",
  decorators: [(story) => <Provider store={store}>{story()}</Provider>],
  tags: ["autodocs"],
};

export const Default = {};
Default.args = {
  data: {
    prodName: "하나저축계좌",
    accBalance: "234,140원",
  },
  sub: false,
};
