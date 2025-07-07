import { FileTree } from "@astrojs/starlight/components";
import { Steps } from "@astrojs/starlight/components";
import { Tabs, TabItem } from "@astrojs/starlight/components";
import { Image } from "astro:assets";
import LLMProviderFeatures from "../../../components/LLMProviderFeatures.astro";

import lmSelectSrc from "../../../assets/vscode-language-models-select.png";
import lmSelectAlt from "../../../assets/vscode-language-models-select.png.txt?raw";

import { YouTube } from "astro-embed";

If you have access to **GitHub Copilot Chat in Visual Studio Code**,
GenAIScript will be able to leverage those [language models](https://code.visualstudio.com/api/extension-guides/language-model) as well.

This mode is useful to run your scripts without having a separate LLM provider or local LLMs. However, those models are not available from the command line
and have additional limitations and rate limiting defined by the GitHub Copilot platform.

There is no configuration needed as long as you have GitHub Copilot installed and configured in Visual Studio Code.

You can force using this model by using `github_copilot_chat:*` as a model name
or set the **GenAIScript > Language Chat Models Provider** setting to true.
This will default GenAIScript to use this provider for model aliases.

<YouTube id="LRrVMiZgWJg" posterQuality="high" />

<Steps>

<ol>

<li>

Install [GitHub Copilot Chat](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot-chat) (emphasis on **Chat**)

</li>

<li>run your script</li>
<li>

Confirm that you are allowing GenAIScript to use the GitHub Copilot Chat models.

</li>
<li>
select the best chat model that matches the one you have in your script

<Image src={lmSelectSrc} alt={lmSelectAlt} loading="lazy" />

(This step is skipped if you already have mappings in your settings)

</li>

</ol>

</Steps>

The mapping of GenAIScript model names to Visual Studio Models is stored in the settings.

:::tip

If you need to check your available premium request quota for GitHub Copilot, go to [Features](https://github.com/settings/copilot/features)

:::