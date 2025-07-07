import { FileTree } from "@astrojs/starlight/components";
import { Steps } from "@astrojs/starlight/components";
import { Tabs, TabItem } from "@astrojs/starlight/components";
import { Image } from "astro:assets";
import LLMProviderFeatures from "../../../components/LLMProviderFeatures.astro";

import oaiModelsSrc from "../../../assets/openai-model-names.png";
import oaiModelsAlt from "../../../assets/openai-model-names.png.txt?raw";

`openai` is the OpenAI chat model provider.
It uses the `OPENAI_API_...` environment variables.

<Steps>

<ol>

<li>

[Upgrade your account](https://platform.openai.com/settings/organization/billing/overview) to get access to the models.
You will get 404s if you do not have a paying account.

</li>

<li>
  Create a new secret key from the [OpenAI API Keys portal](https://platform.openai.com/api-keys).
</li>

<li>

Update the `.env` file with the secret key.

```txt title=".env"
OPENAI_API_KEY=sk_...
```

</li>

<li>

Find the model you want to use
from the [OpenAI API Reference](https://platform.openai.com/docs/models/gpt-4o)
or the [OpenAI Chat Playground](https://platform.openai.com/playground/chat).

<Image src={oaiModelsSrc} alt={oaiModelsAlt} loading="lazy" />

</li>

<li>

Set the `model` field in `script` to the model you want to use.

```js 'model: "openai:gpt-4o"'
script({
    model: "openai:gpt-4o",
    ...
})
```

</li>

</ol>

</Steps>

:::tip[Default Model Configuration]

Use `GENAISCRIPT_MODEL_LARGE` and `GENAISCRIPT_MODEL_SMALL` in your `.env` file to set the default model and small model.

```txt
GENAISCRIPT_MODEL_LARGE=openai:gpt-4o
GENAISCRIPT_MODEL_SMALL=openai:gpt-4o-mini
```

:::

## Logging

You can enable the `genaiscript:openai` and `genaiscript:openai:msg` [logging namespaces](/genaiscript/reference/scripts/logging) for more information about the requests and responses:

<LLMProviderFeatures provider="openai" />