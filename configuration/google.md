import { FileTree } from "@astrojs/starlight/components";
import { Steps } from "@astrojs/starlight/components";
import { Tabs, TabItem } from "@astrojs/starlight/components";
import { Image } from "astro:assets";
import LLMProviderFeatures from "../../../components/LLMProviderFeatures.astro";

## Google AI <a href="" id="google" />

The `google` provider allows you to use Google AI models. It gives you access

:::note

GenAIScript uses the [OpenAI compatibility](https://ai.google.dev/gemini-api/docs/openai) layer of Google AI,
so some [limitations](https://ai.google.dev/gemini-api/docs/openai#current-limitations) apply.

- `seed` is not supported and ignored.
- [fallback tools](/genaiscript/reference/scripts/tools#fallbacktools) are enabled
  using Google finishes the OpenAI compatibilty layer. (See [forum](https://discuss.ai.google.dev/t/gemini-openai-compatibility-multiple-functions-support-in-function-calling-error-400/49431)).

:::

<Steps>

<ol>

<li>

Open [Google AI Studio](https://aistudio.google.com/app/apikey) and create a new API key.

</li>

<li>

Update the `.env` file with the API key.

```txt title=".env"
GEMINI_API_KEY=...
```

</li>

<li>

Find the model identifier in the [Gemini documentation](https://ai.google.dev/gemini-api/docs/models/gemini)
and use it in your script or cli with the `google` provider.

```py "gemini-1.5-pro-002"
...
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro-latest",
});
...
```

then use the model identifier in your script.

```js "gemini-1.5-pro-latest"
script({ model: "google:gemini-1.5-pro-latest" });
```

</li>

</ol>

</Steps>

<LLMProviderFeatures provider="google" />