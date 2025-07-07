import { FileTree } from "@astrojs/starlight/components";
import { Steps } from "@astrojs/starlight/components";
import { Tabs, TabItem } from "@astrojs/starlight/components";
import { Image } from "astro:assets";
import LLMProviderFeatures from "../../../components/LLMProviderFeatures.astro";
import { YouTube } from "astro-embed";

import {
  AZURE_OPENAI_API_VERSION,
  AZURE_AI_INFERENCE_VERSION,
} from "../../../../../packages/core/src/constants";

Azure AI Foundry provides access to serverless and deployed models, both for OpenAI and other providers. There are multiple ways to access those servers
that are supported in GenAIScript:

- without any deployment, using the [Azure AI Model Inference](#azure_ai_inference) provider,
- with deployment for OpenAI models, using the [Azure AI OpenAI Serverless](#azure_serverless) provider,
- with deployments for non-OpenAI models, use the [Azure AI Serverless Models](#azure_serverless_models) provider.

You can deploy "serverless" models through [Azure AI Foundry](https://ai.azure.com/) and pay as you go per token.
You can browse the [Azure AI Foundry model catalog](https://ai.azure.com/explore/models)
and use the [serverless API](https://learn.microsoft.com/en-us/azure/ai-studio/how-to/deploy-models-serverless-availability) filter to see the available models.

There are two types of serverless deployments that require different configurations: OpenAI models and all other models.
The OpenAI models, like `gpt-4o`, are deployed to `.openai.azure.com` endpoints,
while the Azure AI models, like `Meta-Llama-3.1-405B-Instruct` are deployed to `.models.ai.azure.com` endpoints.

They are configured slightly differently.

### Azure AI Inference <a href="" id="azure_ai_inference" />

The [Azure AI Model Inference API](https://learn.microsoft.com/en-us/azure/ai-foundry/model-inference/reference/reference-model-inference-api?tabs=javascript)
provides a single endpoint to access a number of LLMs. This is a great way to experiment as you do not need to create deployments to access models.
It supports both Entra ID and key-based authentication.

```js "azure_ai_inference:gpt-4o"
script({ model: "azure_ai_inference:gpt-4o" });
```

<YouTube
  id="https://www.youtube.com/watch?v=kh670Bxe_1E"
  posterQuality="high"
/>

#### Managed Identity (Entra ID)

<Steps>

<ol>

<li>

**Follow [these steps](https://learn.microsoft.com/en-us/azure/ai-foundry/model-inference/how-to/configure-entra-id?tabs=rest&pivots=ai-foundry-portal)
carefully** to configure the required Roles for your user.

</li>

<li>

Open https://ai.azure.com/ and open your project

</li>

<li>

Configure the **Endpoint Target URL** as the `AZURE_AI_INFERENCE_API_ENDPOINT`.

```txt title=".env"
AZURE_AI_INFERENCE_API_ENDPOINT=https://<resource-name>.services.ai.azure.com/models
```

</li>

<li>

Find the model name in the model catalog with the **Deployment options = Serverless API** filter and use it in your script,
`model: "azure_id_inference:model-id"`.

```js
script({ model: "azure_ai_inference:model-id" });
```

</li>

</ol>

</Steps>

#### API Key

<Steps>

<ol>

<li>

Open https://ai.azure.com/, open your project and go the **Overview** page.

</li>

<li>

Configure the **Endpoint Target URL** as the `AZURE_AI_INFERENCE_API_ENDPOINT` variable and the key in
`AZURE_AI_INFERENCE_API_KEY` in the `.env` file\***\*.\*\***

```txt title=".env"
AZURE_AI_INFERENCE_API_ENDPOINT=https://<resourcename>.services.ai.azure.com/models
AZURE_AI_INFERENCE_API_KEY=...
```

</li>

<li>

Find the model name in the model catalog with the **Deployment options = Serverless API** filter and use it in your script,
`model: "azure_id_inference:model-id"`.

```js
script({ model: "azure_ai_inference:model-id" });
```

</li>

</ol>

</Steps>

#### API Version

The default API version for Azure AI Inference is {AZURE_AI_INFERENCE_VERSION}.
You can change it by setting the `AZURE_AI_INFERENCE_API_VERSION` environment variable
(see [Azure AI Documentation](https://learn.microsoft.com/en-us/azure/ai-services/openai/api-version-deprecation))

```txt title=".env"
AZURE_AI_INFERENCE_API_VERSION=2025-01-01-preview
```

<LLMProviderFeatures provider="azure_ai_inference" />

### Azure AI OpenAI Serverless <a href="" id="azure_serverless" />

The `azure_serverless` provider supports OpenAI models deployed through the Azure AI Foundry serverless deployments.
It supports both Entra ID and key-based authentication.

```js "azure_serverless:"
script({ model: "azure_serverless:deployment-id" });
```

:::note

This kind of deployment is different from the **Azure OpenAI** deployments (`azure` provider).

:::

#### Managed Identity (Entra ID)

<Steps>

<ol>

<li>

Open https://ai.azure.com/, open your project and go the **Deployments** page.

</li>

<li>

Deploy a **base model** from the catalog.
You can use the `Deployment Options` -> `Serverless API` option to deploy a model as a serverless API.

</li>

<li>

Deploy an OpenAI base model.
This will also create a new Azure OpenAI resource in your subscription (which may be invisible to you, more later).

</li>

<li>

Update the `.env` file with the deployment endpoint in the `AZURE_SERVERLESS_OPENAI_API_ENDPOINT` variable.

```txt title=".env"
AZURE_SERVERLESS_OPENAI_API_ENDPOINT=https://....openai.azure.com
```

</li>

<li>

Go back to the **Overview** tab in your Azure AI Foundry project and
click on **Open in Management center**.

</li>

<li>

Click on the **Azure OpenAI Service** resource, then click on the **Resource** external link which will take you back to the (underlying) Azure OpenAI service
in Azure Portal.

</li>

<li>

Navigate to **Access Control (IAM)**, then **View My Access**. Make sure your
user or service principal has the **Cognitive Services OpenAI User/Contributor** role.
If you get a `401` error, click on **Add**, **Add role assignment** and add the **Cognitive Services OpenAI User** role to your user.

</li>

</ol>

</Steps>

At this point, you are ready to login with the Azure CLI and use the managed identity.

:::note

The resources created by Azure AI Foundry are not visible by default in the Azure Portal.
To make them visible, open [All resources](https://portal.azure.com/#browse/all), click **Manage view**
and select **Show hidden types**.

:::

<Steps>

<ol>

<li>

Install the [Azure CLI](https://learn.microsoft.com/en-us/javascript/api/overview/azure/identity-readme?view=azure-node-latest#authenticate-via-the-azure-cli).

</li>

<li>

Open a terminal and login

```sh
az login
```

</li>

</ol>

</Steps>

#### API Key

<Steps>

<ol>

<li>

Open your [Azure OpenAI resource](https://portal.azure.com) and navigate to **Resource Management**, then **Keys and Endpoint**.

</li>

<li>

Update the `.env` file with the endpoint and the secret key (**Key 1** or **Key 2**) and the endpoint.

```txt title=".env"
AZURE_SERVERLESS_OPENAI_API_ENDPOINT=https://....openai.azure.com
AZURE_SERVERLESS_OPENAI_API_KEY=...
```

</li>

</ol>

</Steps>

<LLMProviderFeatures provider="azure_serverless" />

### Azure AI Serverless Models <a href="" id="azure_serverless_models" />

The `azure_serverless_models` provider supports non-OpenAI models, such as DeepSeek R1/v3, deployed through the Azure AI Foundary serverless deployments.

```js "azure_serverless_models:"
script({ model: "azure_serverless_models:deployment-id" });
```

#### Managed Identity (Entra ID)

<Steps>

<ol>

<li>

Open your **Azure AI Project** resource in the [Azure Portal](https://portal.azure.com)

</li>
<li>

Navigate to **Access Control (IAM)**, then **View My Access**. Make sure your
user or service principal has the **Azure AI Developer** role.
If you get a `401` error, click on **Add**, **Add role assignment** and add the **Azure AI Developer** role to your user.

</li>

<li>

Configure the **Endpoint Target URL** as the `AZURE_SERVERLESS_MODELS_API_ENDPOINT`.

```txt title=".env"
AZURE_SERVERLESS_MODELS_API_ENDPOINT=https://...models.ai.azure.com
```

</li>

<li>

Navigate to **deployments** and make sure that you have your LLM deployed and copy the Deployment Info name, you will need it in the script.

</li>

<li>

Update the `model` field in the `script` function to match the model deployment name in your Azure resource.

```js 'model: "azure_serverless:deployment-info-name"'
script({
    model: "azure_serverless:deployment-info-name",
    ...
})
```

</li>

</ol>

</Steps>

#### API Key

<Steps>

<ol>

<li>

Open https://ai.azure.com/ and open the **Deployments** page.

</li>

<li>

Deploy a **base model** from the catalog.
You can use the `Deployment Options` -> `Serverless API` option to deploy a model as a serverless API.

</li>

<li>

Configure the **Endpoint Target URL** as the `AZURE_SERVERLESS_MODELS_API_ENDPOINT` variable and the key in
`AZURE_SERVERLESS_MODELS_API_KEY` in the `.env` file\***\*.\*\***

```txt title=".env"
AZURE_SERVERLESS_MODELS_API_ENDPOINT=https://...models.ai.azure.com
AZURE_SERVERLESS_MODELS_API_KEY=...
```

</li>

<li>

Find the deployment name and use it in your script, `model: "azure_serverless_models:deployment-id"`.

</li>

</ol>

</Steps>

#### Support for multiple inference deployments

You can update the `AZURE_SERVERLESS_MODELS_API_KEY` with a list of `deploymentid=key` pairs to support multiple deployments (each deployment has a different key).

```txt title=".env"
AZURE_SERVERLESS_MODELS_API_KEY="
model1=key1
model2=key2
model3=key3
"
```

<LLMProviderFeatures provider="azure_serverless_models" />