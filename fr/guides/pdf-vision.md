import { Code } from "@astrojs/starlight/components"
import source from "../../../../../../packages/sample/genaisrc/pdfocr.genai.mts?raw";

L'extraction de markdown à partir de fichiers PDF est une tâche délicate... le format de fichier PDF n'a jamais vraiment été conçu pour être relu.

De nombreuses techniques sont utilisées dans le domaine pour obtenir les meilleurs résultats :

* on peut lire le texte en utilisant [pdfjs de Mozilla](https://mozilla.github.io/pdf.js/) (GenAIScript utilise cela), ce qui peut donner certains résultats mais le texte peut être brouillé ou pas dans le bon ordre. Et les tableaux sont un défi. Et cela ne fonctionnera pas pour les PDF qui ne contiennent que des images.
* une autre technique serait d'appliquer un algorithme OCR sur des segments de l'image pour « lire » le texte rendu.

Dans ce guide, nous allons construire un GenAIScript qui utilise un LLM avec support visuel pour extraire le texte et les images d'un PDF, en convertissant chaque page en markdown.

Supposons que l'utilisateur exécute notre script sur un fichier PDF, il s'agit donc du premier élément de `env.files`.
Nous utilisons le parseur PDF pour extraire à la fois les pages et les images du fichier PDF. L'option `renderAsImage` est définie sur `true`, ce qui signifie que chaque page est également convertie en image.

```ts "renderAsImage: true"
const { pages, images } = await parsers.PDF(env.files[0], {
    renderAsImage: true,
})
```

Nous commençons une boucle qui itère sur chaque page du PDF.

```ts
for (let i = 0; i < pages.length; ++i) {
    const page = pages[i]
    const image = images[i]
```

À chaque itération, nous extrayons la page courante et son image correspondante.
Nous utilisons la fonction `runPrompt` pour traiter à la fois les données textuelles et visuelles.

```ts
    // mix of text and vision
    const res = await runPrompt(
        (ctx) => {
            if (i > 0) ctx.def("PREVIOUS_PAGE", pages[i - 1])
            ctx.def("PAGE", page)
            if (i + 1 < pages.length) ctx.def("NEXT_PAGE", pages[i + 1])
            ctx.defImages(image, { autoCrop: true, greyscale: true })
```

Le contexte `ctx` est configuré avec des définitions pour la page courante, et éventuellement les pages précédente et suivante. Les images sont définies avec un recadrage automatique et des ajustements en niveaux de gris.

```ts
ctx.$`You are an expert in reading and extracting markdown from a PDF image stored in the attached images.

            Your task is to convert the attached image to markdown.

            - We used pdfjs-dist to extract the text of the current page in PAGE, the previous page in PREVIOUS_PAGE and the next page in NEXT_PAGE.
            - Generate markdown. Do NOT emit explanations.
            - Generate CSV tables for tables.
            - For images, generate a short alt-text description.
        `
```

Cette invite demande à GenAI de convertir l'image de la page en markdown. Elle met en avant l'utilisation de `pdfjs-dist` pour l'extraction du texte et indique comment gérer le texte, les tableaux et les images.

```ts
        },
        {
            model: "small",
            label: `page ${i + 1}`,
            cache: "pdf-ocr",
            system: [
                "system",
                "system.assistant",
                "system.safety_jailbreak",
                "system.safety_harmful_content",
            ],
        }
    )
```

Nous configurons le modèle avec des paramètres spécifiques, tels que l'étiquetage de chaque page, les réglages de cache, et les configurations système pour la sécurité.

```ts
    ocrs.push(parsers.unfence(res.text, "markdown") || res.error?.message)
}
```

Chaque résultat est traité, reconverti en markdown, puis ajouté au tableau `ocrs`.

```ts
console.log(ocrs.join("\n\n"))
```

Enfin, nous affichons tous les résultats OCR collectés au format markdown.

## Exécution du script

Pour exécuter ce script avec le CLI GenAIScript, ouvrez votre terminal et lancez la commande :

```bash
genaiscript run pdfocr <mypdf.pdf>
```

Pour plus de détails sur l'installation et la configuration du CLI GenAIScript, consultez la [documentation officielle](https://microsoft.github.io/genaiscript/getting-started/installation).

Ce script offre un moyen simple de convertir des PDF en markdown, facilitant ainsi la manipulation programmatique de leur contenu. Bon codage ! 🚀

## Code source complet

Le code source complet du script est disponible ci-dessous :

<Code code={source} wrap={true} lang="js" title="pdfocr.genai.mts" />