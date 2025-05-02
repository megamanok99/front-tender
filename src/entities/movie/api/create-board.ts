export const createBoardKeys = {
  board: {
    all: ["create-board"] as const,
    detail: (id: string) => ["create-board", id] as const,
  },
};
