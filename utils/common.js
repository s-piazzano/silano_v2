const generateTitle = (subs, comps, oe = "", motorType = "") => {
    const mainCategory = subs?.[0]?.attributes?.name || "";
    const compatibilityInfo = comps?.map((comp) => {
        const make = comp.make?.data?.attributes?.name || "";
        const model = comp.model?.data?.attributes?.name || "";
        const capacity = (comp.engine_capacity?.data && comp.engine_capacity.data.id != 5)
            ? comp.engine_capacity.data.attributes.capacity
            : "";
        const fuel = (comp.fuel_system?.data && comp.fuel_system.data.id != 8)
            ? comp.fuel_system.data.attributes.name
            : "";

        return `${make} ${model} ${capacity} ${fuel}`.trim();
    }).filter(Boolean).join(" / ");

    return `${mainCategory} ${compatibilityInfo} ${oe} ${motorType}`.replace(/\s+/g, ' ').trim();
};


export { generateTitle }