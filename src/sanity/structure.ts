import type { StructureResolver } from 'sanity/structure';

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      // Singleton Hero Video Reel
      S.listItem()
        .title('Hero Video Reel')
        .child(
          S.document()
            .schemaType('heroVideoReel')
            .documentId('heroVideoReel')
            .title('Main Hero Reel')
        ),
      S.divider(),
      // Regular content types (exclude the singleton to avoid duplication)
      ...S.documentTypeListItems().filter(
        (listItem) => !['heroVideoReel'].includes(listItem.getId() as string)
      ),
    ]);
