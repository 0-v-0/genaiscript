import { FileTree } from "@astrojs/starlight/components";
import { Steps } from "@astrojs/starlight/components";
import { Tabs, TabItem } from "@astrojs/starlight/components";
import { Image } from "astro:assets";
import LLMProviderFeatures from "../../../components/LLMProviderFeatures.astro";

[Ollama](https://ollama.ai/) is a desktop application that lets you download and run models locally.

Running tools locally may require additional GPU resources depending on the model you are using.

Use the `ollama` provider to access Ollama models.

:::note

GenAIScript is currently using the OpenAI API compatibility layer of Ollama.

:::

<Steps>

<ol>

<li>

Start the Ollama application or

```sh
ollama serve
```

</li>

<li>

Update your script to use the `ollama:phi3.5` model (or any [other model](https://ollama.com/library) or from [Hugging Face](https://huggingface.co/docs/hub/en/ollama)).

```js "ollama:phi3.5"
script({
    ...,
    model: "ollama:phi3.5",
})
```

GenAIScript will automatically pull the model, which may take some time depending on the model size. The model is cached locally by Ollama.

</li>

<li>

If Ollama runs on a server or a different computer or on a different port,
you have to configure the `OLLAMA_HOST` environment variable to connect to a remote Ollama server.

```txt title=".env"
OLLAMA_HOST=https://<IP or domain>:<port>/ # server url
OLLAMA_HOST=0.0.0.0:12345 # different port
```

</li>

</ol>

</Steps>

You can specify the model size by adding the size to the model name, like `ollama:llama3.2:3b`.

```js "ollama:llama3.2:3b"
script({
    ...,
    model: "ollama:llama3.2:3b",
})
```

### Ollama with Hugging Face models

You can also use [GGUF models](https://huggingface.co/models?library=gguf) from [Hugging Face](https://huggingface.co/docs/hub/en/ollama).

```js "hf.co/bartowski/Llama-3.2-1B-Instruct-GGUF"
script({
    ...,
    model: "ollama:hf.co/bartowski/Llama-3.2-1B-Instruct-GGUF",
})
```

### Ollama with Docker

You can conviniately run Ollama in a Docker container.

- if you are using a [devcontainer](https://code.visualstudio.com/devcontainers)
  or a [GitHub Codespace](https://github.com/features/codespaces),
  make sure to add the `docker-in-docker` option to your `devcontainer.json` file.

```json
{
  "features": {
    "docker-in-docker": "latest"
  }
}
```

- start the [Ollama container](https://ollama.com/blog/ollama-is-now-available-as-an-official-docker-image)

```sh wrap
docker run -d -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama
```

- stop and remove the Ollama containers

```sh wrap
docker stop ollama && docker rm ollama
```

:::tip

Add these scripts to your `package.json` file to make it easier to start and stop the Ollama container.

```json
{
  "scripts": {
    "ollama:start": "docker run -d -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama",
    "ollama:stop": "docker stop ollama && docker rm ollama"
  }
}
```

:::

<LLMProviderFeatures provider="ollama" />