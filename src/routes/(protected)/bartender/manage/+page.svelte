<script>
    
    // @ts-nocheck
	import selected from '$lib/stores/structureStore.js';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let bills = [];
	let selectedData;
	onMount(async () => {
		selected.subscribe((data) => (selectedData = data));

		if (!selectedData) return;
		const response = await fetch('/api/bartender/getBills', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ sid: selectedData })
		});
		bills = await response.json();
	});

	let selectedRecords = new Set();
	let actualSum = 0;
	function toggleSelection(event) {
		const key = JSON.stringify(event.target.name.split('_'));
		const price = parseInt(event.target.dataset.price);

		if (event.target.checked) {
			selectedRecords.add(key);
			actualSum += price;
		} else {
			selectedRecords.delete(key);
			actualSum -= price;
		}
	}

	async function handleSubmit(event) {
		event.preventDefault();
		if (!confirm(`mark as paid? the sum is ${actualSum}`)) return;

		const recordsToSend = Array.from(selectedRecords).map(JSON.parse);
		try {
			const response = await fetch('/api/bartender/setPaid', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(recordsToSend)
			});

			if (response.ok) {
				alert('success');
				selectedRecords.clear();
			} else {
				alert('Error');
			}
		} catch (error) {
            console.error(error);
			alert('Failed to connect to the server');
		}

        goto("/bartender");
	}
</script>

<h2>manage bills</h2>
<a href="/bartender">back to bartender</a><br />
<br />
{#if actualSum > 0}sum: <b>{actualSum}</b><br />{/if}
{#if !selectedData}select structure you want to manage<br />{/if}
{#if bills.length > 0}
	<form on:submit={handleSubmit}>
		{#if actualSum > 0}<button type="submit">mark as paid</button>{/if}
		<table>
			<thead>
				<tr>
					<th scope="col">user</th>
					<th scope="col">item</th>
					<th scope="col">created</th>
					<th scope="col">price</th>
					<th scope="col"></th>
				</tr>
			</thead>
			<tbody>
				{#each bills as bill}
					<tr>
						<td>
							{bill.uid}: <b>{bill.l_name}</b>
							{bill.f_name}(<a href="mailto:{bill.email}">{bill.email}</a>,
							<a href="tel:{bill.phone}">{bill.phone}</a>)
						</td>
						<td>
							<i>{bill.pid}: {bill.label}</i>
						</td>
						<td>
							{new Intl.DateTimeFormat('cs-CZ', { dateStyle: 'full', timeStyle: 'medium' }).format(
								new Date(bill.created)
							)}
						</td>
						<td>
							<b>{bill.price}</b>
						</td>
						<td>
							<input
								type="checkbox"
								name="{bill.uid}_{bill.pid}_{bill.created}"
								data-price={bill.price}
								on:change={toggleSelection}
							/>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</form>
{:else}
	no bills to manage
{/if}
