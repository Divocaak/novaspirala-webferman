<script>
	export let content;
	export let type;
</script>

<span class="info-badge {type}">{@html content}</span>

<style>
	.info-badge {
		display: inline-block;
		padding: 2px 5px;
		border-radius: 3px;

		font-size: 0.7rem;
		font-weight: bold;
		white-space: nowrap;
	}

	.info-badge.vacation {
		background: #ff6961;
		color: white;
	}

	.info-badge.booking {
		background-color: #80ef80;
		color: white;
	}
</style>
