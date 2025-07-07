import { FileTree } from "@astrojs/starlight/components";
import { Steps } from "@astrojs/starlight/components";
import { Tabs, TabItem } from "@astrojs/starlight/components";
import { Image } from "astro:assets";
import LLMProviderFeatures from "../../../components/LLMProviderFeatures.astro";

[LocalAI](https://localai.io/) act as a drop-in replacement REST API that’s compatible
with OpenAI API specifications for local inferencing. It uses free Open Source models
and it runs on CPUs.

LocalAI acts as an OpenAI replacement, you can see the [model name mapping](https://localai.io/basics/container/#all-in-one-images)
used in the container, like `gpt-4` is mapped to `phi-2`.

<Steps>

<ol>

<li>

Install Docker. See the [LocalAI documentation](https://localai.io/basics/getting_started/#prerequisites) for more information.

</li>

<li>

Update the `.env` file and set the api type to `localai`.

```txt title=".env" "localai"
OPENAI_API_TYPE=localai
```

</li>

</ol>

</Steps>

To start LocalAI in docker, run the following command:

```sh
docker run -p 8080:8080 --name local-ai -ti localai/localai:latest-aio-cpu
docker start local-ai
docker stats
echo "LocalAI is running at http://127.0.0.1:8080"
```