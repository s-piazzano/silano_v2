import Link from "next/link";

interface Items {
  name: string;
  url: string;
}
interface ClassfierProps {
  divItems?: Array<string>;
  items: Array<Items>;
}

export default function Classifier({ divItems, items }: ClassfierProps) {
  return (
    <div className="flex flex-col">
      {divItems?.length ? (
        divItems.map((a, index) => {
          return (
            <div key={index} className="mb-2">
              <span className="text-lg">{a}</span>
              <div className="w-full border-b mb-2"></div>
              <div className="w-full flex flex-wrap ">
                {items
                  .filter((x) => x.name[0] == a)
                  .map((y, index) => {
                    return (
                      <Link
                        key={`div-${a}-${index}`}
                        href={y.url}
                        className="m-2 p-2 border border-forest"
                        prefetch={false}
                      >
                        {y.name}
                      </Link>
                    );
                  })}
              </div>
            </div>
          );
        })
      ) : (
        <div className="w-full flex flex-wrap">
          {items.map((x, index) => (
            <Link
              key={`div-${index}`}
              href={x?.url}
              className="m-2 p-2 border border-forest"
              prefetch={false}
            >
              {x.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
