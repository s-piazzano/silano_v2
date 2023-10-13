export default function DownloadArea({ component }) {
  return (
    <div className="bg-base-200 p-4 shadow">
      <h1 className="mb-4">{component.title}</h1>
      <ul className="mt-2 ml-2">
        {component.links &&
          component.links.map((link) => (
            <li className="mt-2" key={`link-${link.id}`}>
              {" "}
              <a href={link.url} target="_blank" rel="noreferrer" download>
                {link.name}
              </a>
            </li>
          ))}
      </ul>
    </div>
  );
}
