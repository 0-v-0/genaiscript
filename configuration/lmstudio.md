import { FileTree } from "@astrojs/starlight/components";
import { Steps } from "@astrojs/starlight/components";
import { Tabs, TabItem } from "@astrojs/starlight/components";
import { Image } from "astro:assets";
import LLMProviderFeatures from "../../../components/LLMProviderFeatures.astro";

The `lmstudio` provider connects to the [LMStudio](https://lmstudio.ai/) headless server.
and allows to run local LLMs.

<Steps>

<ol>

<li>

Install [LMStudio](https://lmstudio.ai/download) (v0.3.5+)

</li>

<li>

Open LMStudio

</li>

<li>

Open the [Model Catalog](https://lmstudio.ai/models),
select your model and load it at least once so it is downloaded locally.

</li>

<li>

Open the settings (Gearwheel icon) and enable **Enable Local LLM Service**.

</li>

<li>

GenAIScript assumes the local server is at `http://localhost:1234/v1` by default.
Add a `LMSTUDIO_API_BASE` environment variable to change the server URL.

```txt title=".env"
LMSTUDIO_API_BASE=http://localhost:2345/v1
```

</li>

</ol>

</Steps>

Find the model **API identifier** in the dialog of loaded models then use that identifier in your script:

```js '"lmstudio:llama-3.2-1b"'
script({
  model: "lmstudio:llama-3.2-1b-instruct",
});
```

- GenAIScript uses the [LMStudio CLI](https://lmstudio.ai/docs/cli)
  to pull models on demand.
- Specifying the quantization is currently not supported.

<LLMProviderFeatures provider="lmstudio" />

### LM Studio and Hugging Face Models

Follow [this guide](https://huggingface.co/blog/yagilb/lms-hf) to load Hugging Face models into LMStudio.

## Jan

The `jan` provider connects to the [Jan](https://jan.ai/) local server.

<Steps>

<ol>

<li>

[Jan](https://jan.ai/)

</li>

<li>

Open Jan and download the models you plan to use. You will find the model
identifier in the model description page.

</li>

<li>

Click on the **Local API Server** icon (lower left), then **Start Server**.

Keep the desktop application running!

</li>

</ol>

</Steps>

To use Jan models, use the `jan:modelid` syntax.
If you change the default server URL, you can set the `JAN_API_BASE` environment variable.

```txt title=".env"
JAN_API_BASE=http://localhost:1234/v1
```

<LLMProviderFeatures provider="jan" />