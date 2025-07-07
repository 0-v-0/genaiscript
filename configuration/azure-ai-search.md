import { FileTree } from "@astrojs/starlight/components";
import { Steps } from "@astrojs/starlight/components";
import { Tabs, TabItem } from "@astrojs/starlight/components";
import { Image } from "astro:assets";
import LLMProviderFeatures from "../../../components/LLMProviderFeatures.astro";

This is not a LLM provider, but a content search provider. However since it is configured similarly to the other Azure services,
it is included here. It allows you to do [vector search](/genaiscript/reference/scripts/vector-search) of your documents
using [Azure AI Search](https://learn.microsoft.com/en-us/azure/search/search-what-is-azure-search).

```js "azure_search:"
const index = await retrieval.index("animals", {
  type: "azure_ai_search",
});
await index.insertOrUpdate(env.files);
const docs = await index.search("cat dog");
```

### Managed Identity (Entra ID)

The service is configured through the `AZURE_AI_SEARCH_ENDPOINT` environment variable
and the [configuration of the managed identity](https://learn.microsoft.com/en-us/azure/search/search-security-rbac?tabs=roles-portal-admin%2Croles-portal%2Croles-portal-query%2Ctest-portal%2Ccustom-role-portal).

```txt
AZURE_AI_SEARCH_ENDPOINT=https://{{service-name}}.search.windows.net/
```

<Steps>

<ol>

<li>

Open your **Azure AI Search** resource in the [Azure Portal](https://portal.azure.com),
click on **Overview** and click on **Properties**.

</li>

<li>

Click on **API Access control** and enable **Role-based access control** or **Both**.

</li>

<li>

Open the **Access Control (IAM)** tab and make sure your user
or service principal has the **Search Service Contributor** role.

</li>

</ol>

</Steps>

### API Key

The service is configured through the `AZURE_AI_SEARCH_ENDPOINT` and `AZURE_AI_SEARCH_API_KEY` environment variables.

```txt
AZURE_AI_SEARCH_ENDPOINT=https://{{service-name}}.search.windows.net/
AZURE_AI_SEARCH_API_KEY=...
```