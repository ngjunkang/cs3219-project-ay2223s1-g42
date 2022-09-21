import { Tab } from "@headlessui/react";
import cx from "classnames";
import { ReactNode } from "react";

type BaseProp = {
  values: Record<string, ReactNode>;
};

const BaseTabs = ({ values }: BaseProp) => {
  return (
    <Tab.Group>
      <Tab.List className="flex flex-row divide-x-[1px] divide-neutral-900">
        {Object.keys(values).map((tab) => (
          <Tab
            key={tab}
            className={({ selected }) =>
              cx(
                "w-full py-2.5 text-sm font-medium leading-5 border-b-[1px] border-b-neutral-900",
                {
                  "bg-neutral-800 text-neutral-50": selected,
                  "text-neutral-800 hover:bg-neutral-300 bg-white": !selected,
                }
              )
            }
          >
            {tab}
          </Tab>
        ))}
      </Tab.List>
      <Tab.Panels className="h-full w-full">
        {Object.values(values).map((value, i) => (
          <Tab.Panel key={i} className={cx("bg-neutral-100 p-3")}>
            {value}
          </Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  );
};

export { BaseTabs };