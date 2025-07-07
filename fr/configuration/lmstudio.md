import { FileTree } from "@astrojs/starlight/components";
import { Steps } from "@astrojs/starlight/components";
import { Tabs, TabItem } from "@astrojs/starlight/components";
import { Image } from "astro:assets";
import LLMProviderFeatures from "../../../../components/LLMProviderFeatures.astro";

Le fournisseur `lmstudio` se connecte au serveur sans interface [LMStudio](https://lmstudio.ai/) et permet de faire fonctionner des LLM locaux.

<Steps>
  <ol>
    <li>
      Installez [LMStudio](https://lmstudio.ai/download) (v0.3.5+)
    </li>

    <li>
      Ouvrez LMStudio
    </li>

    <li>
      Ouvrez le [Catalogue de modèles](https://lmstudio.ai/models),
      sélectionnez votre modèle et chargez-le au moins une fois afin qu'il soit téléchargé localement.
    </li>

    <li>
      Ouvrez les paramètres (icône roue dentée) et activez **Activer le service LLM local**.
    </li>

    <li>
      GenAIScript suppose que le serveur local est par défaut à l'adresse `http://localhost:1234/v1`.
      Ajoutez une variable d'environnement `LMSTUDIO_API_BASE` pour changer l'URL du serveur.

      ```txt title=".env"
      LMSTUDIO_API_BASE=http://localhost:2345/v1
      ```
    </li>
  </ol>
</Steps>

Trouvez l'**identifiant API** du modèle dans la fenêtre des modèles chargés, puis utilisez cet identifiant dans votre script :

```js '"lmstudio:llama-3.2-1b"'
script({
  model: "lmstudio:llama-3.2-1b-instruct",
});
```

* GenAIScript utilise la [CLI LMStudio](https://lmstudio.ai/docs/cli)
  pour télécharger les modèles à la demande.
* La spécification de la quantification n'est actuellement pas prise en charge.

<LLMProviderFeatures provider="lmstudio" />

### LM Studio et les modèles Hugging Face

Suivez [ce guide](https://huggingface.co/blog/yagilb/lms-hf) pour charger des modèles Hugging Face dans LMStudio.

## Jan

Le fournisseur `jan` se connecte au serveur local [Jan](https://jan.ai/).

<Steps>
  <ol>
    <li>
      [Jan](https://jan.ai/)
    </li>

    <li>
      Ouvrez Jan et téléchargez les modèles que vous envisagez d’utiliser. Vous trouverez l'identifiant du modèle dans la page de description du modèle.
    </li>

    <li>
      Cliquez sur l’icône **Serveur API Local** (en bas à gauche), puis sur **Démarrer le serveur**.

      Laissez l’application de bureau ouverte !
    </li>
  </ol>
</Steps>

Pour utiliser les modèles Jan, employez la syntaxe `jan:modelid`.
Si vous changez l’URL par défaut du serveur, vous pouvez définir la variable d’environnement `JAN_API_BASE`.

```txt title=".env"
JAN_API_BASE=http://localhost:1234/v1
```

<LLMProviderFeatures provider="jan" />