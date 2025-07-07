import { FileTree } from "@astrojs/starlight/components";
import { Steps } from "@astrojs/starlight/components";
import { Tabs, TabItem } from "@astrojs/starlight/components";
import { Image } from "astro:assets";
import LLMProviderFeatures from "../../../components/LLMProviderFeatures.astro";

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