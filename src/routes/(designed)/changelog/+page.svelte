<script>
	import MarkdownIt from 'markdown-it';
	const md = new MarkdownIt();
	const source = `
### v0.2.0, release dd. mm. yyyy
#### přidáno
- tlačítka _Vybrat vše_ a _Odebrat vše_ ve všech formulářích pro výběr uživatelů
#### upraveno
#### opraveno
    `;

	/* TODO dopsat starý verze bez změn */
	$: html = md.render(source);
</script>

<h2>Changelog</h2>
<div class="markdown">{@html html}</div>
