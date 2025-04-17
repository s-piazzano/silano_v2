import { LinkInt } from "@/interfaces/common";

interface Data {
  id?: string;
  attributes: {
    title: string;
    slug: URL;
  };
}

interface Page {
  __typename: string;
  data: Array<Data>;
}

interface Section {
  __typename: string;
  id?: string;
  title: string;
  pages: Page;
}

export interface Layout {
  __typename?: string;
  id?: number;
  name: string;
  description?: string;
  url: URL;
  linkName?: string;
  type: string;
  sections: Array<Section>;
  links?: Array<LinkInt>;
}
