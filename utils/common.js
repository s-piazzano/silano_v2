const generateTitle = (subs, comps, oe = "", motorType = "") => {
    return ` ${subs[0].attributes.name} ${comps
        .map(
            (comp) =>
                `${comp.make.data ? comp.make.data.attributes.name : ""} ${comp.model.data ? comp.model.data.attributes.name : ""
                } ${comp.engine_capacity.data && comp.engine_capacity.data.id != 5
                    ? comp.engine_capacity.data.attributes.capacity
                    : ""
                } ${comp.fuel_system.data && comp.fuel_system.data.id != 8
                    ? comp.fuel_system.data.attributes.name
                    : ""
                }`
        )
        .join(" / ")} ${oe ? oe : ""} ${motorType ? motorType : ""}`;
};


export { generateTitle }