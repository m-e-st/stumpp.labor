---
type: page
layout: main.njk
permalink: "{{ page.filePathStem }}.html"
version: 2025-05-10

---

## Markdown Samples

{{ text.lorem }}

{% crypt "0218" %}
{{ text.loremShort }}
{% endcrypt %}


{% crypt "0218" %}
{{ text.lorem }}
{% endcrypt %}

<script>

/*** initialization on document ready ***/

document.addEventListener("DOMContentLoaded", function(event) {
	contentDecryption("0218", "Hah", "w3-hide w3-jumbo");
});	

</script>
