import { Extension } from "@tiptap/core"
import "@tiptap/extension-text-style"

export type FontSizeOptions = {
  types: string[]
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    fontSize: {
      setFontSize: (size: string) => ReturnType
      unsetFontSize: () => ReturnType
    }
    color: {
      setColor: (color: string) => ReturnType
      unsetColor: () => ReturnType
    }
  }
}

export const FontSize = Extension.create<FontSizeOptions>({
  name: "fontSize",

  addOptions() {
    return {
      types: ["textStyle"],
    }
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) =>
              element.style.fontSize?.replace(/['"]+/g, ""),
            renderHTML: (attributes) => {
              if (!attributes.fontSize) return {}
              return { style: `font-size: ${attributes.fontSize}` }
            },
          },
          color: {
            default: null,
            parseHTML: (element) =>
              element.style.color?.replace(/['"]+/g, ""),
            renderHTML: (attributes) => {
              if (!attributes.color) return {}
              return { style: `color: ${attributes.color}` }
            },
          },
        },
      },
    ]
  },

  addCommands() {
    return {
      setFontSize:
        (fontSize: string) =>
        ({ chain }) => {
          return chain()
            .setMark("textStyle", { fontSize })
            .run()
        },
      unsetFontSize:
        () =>
        ({ chain }) => {
          return chain()
            .setMark("textStyle", { fontSize: null })
            .removeEmptyTextStyle()
            .run()
        },
      setColor:
        (color: string) =>
        ({ chain }) => {
          return chain()
            .setMark("textStyle", { color })
            .run()
        },
      unsetColor:
        () =>
        ({ chain }) => {
          return chain()
            .setMark("textStyle", { color: null })
            .removeEmptyTextStyle()
            .run()
        },
    }
  },
})
