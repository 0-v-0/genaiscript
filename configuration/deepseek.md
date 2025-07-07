import { FileTree } from "@astrojs/starlight/components";
import { Steps } from "@astrojs/starlight/components";
import { Tabs, TabItem } from "@astrojs/starlight/components";
import { Image } from "astro:assets";
import LLMProviderFeatures from "../../../components/LLMProviderFeatures.astro";

`deepseek` is the [DeepSeek (https://www.deepseek.com/)](https://www.deepseek.com/) chat model provider.
It uses the `DEEPSEEK_API_...` environment variables.

<Steps>

<ol>

<li>
  Create a new secret key from the [DeepSeek API Keys
  portal](https://platform.deepseek.com/usage).
</li>

<li>

Update the `.env` file with the secret key.

```txt title=".env"
DEEPSEEK_API_KEY=sk_...
```

</li>

<li>

Set the `model` field in `script` to `deepseek:deepseek:deepseek-chat` which is currently the only supported model.

```js 'model: "deepseek:deepseek-chat"'
script({
    model: "deepseek:deepseek-chat",
    ...
})
```

</li>

</ol>

</Steps>

<LLMProviderFeatures provider="deepseek" />