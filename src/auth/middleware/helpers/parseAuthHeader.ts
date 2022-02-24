const regex = /(\S+)\s+(\S+)/;

export interface ParsedAuthHeader {
  schema: string;

  value: string;
}

export const parseAuthHeader = (header: unknown): ParsedAuthHeader | null => {
  if (typeof header !== 'string') {
    return null;
  }

  const matches = header.match(regex);

  return matches && { schema: matches[1], value: matches[2] };
};
