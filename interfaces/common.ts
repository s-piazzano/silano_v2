export interface Image {
  data: {
    attributes: {
      url: string;
      formats: {
        thumbnail: { url: string };
        small: { url: string };
        medium: {
          url: string;
        };
      };
    };
  };
}

export interface LinkInt {
  url: URL;
  name: string;
  alt?: string;
}

export interface Activity {
  id: number;
  title: string;
  description: string;
  link: LinkInt;
  image: Image;
}
