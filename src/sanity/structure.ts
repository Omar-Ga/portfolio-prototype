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
      S.listItem()
        .title('Contact Video Reel')
        .child(
          S.document()
            .schemaType('contactVideoReel')
            .documentId('contactVideoReel')
            .title('Contact Video Reel')
        ),
      S.listItem()
        .title('Personal Info')
        .child(
          S.document()
            .schemaType('personalInfo')
            .documentId('personalInfo')
            .title('Personal Info')
        ),
      S.divider(),
      // Regular content types (exclude the singleton to avoid duplication)
      ...S.documentTypeListItems().filter(
        (listItem) => !['heroVideoReel', 'contactVideoReel', 'personalInfo'].includes(listItem.getId() as string)
      ),
    ]);
