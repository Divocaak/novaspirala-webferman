<script>
    import MarkdownIt from 'markdown-it';
	const md = new MarkdownIt();
	const source = `
### v0.2.0, release dd. mm. yyyy
#### přidáno
#### upraveno
#### opraveno
    `;

	$: html = md.render(source);
</script>

<h2>Changelog</h2>
<div class="markdown">{@html html}</div>