<script>
	export let event;
</script>


<!-- {
  id: 2,
  id_order: '',
  label: 'test event',
  date_from: '2025-07-16T22:00:00.000Z',
  date_to: '2025-07-17T22:00:00.000Z',
  description: '',
  txtClr: '#ffffff',
  bgClr: '#000000',
  
  createdById: 1,
  login: 'admin',
  email: 'divokyvojta@gmail.com',
  phone: 722680481,
  f_name: 'Vojtěch',
  l_name: 'Divoký',
  
  vLabel: 'Velký sál',
  addr_label: 'Nová Spirála',
  addr_street: 'Výstaviště 170/00',
  addr_town: 'Praha 7',
  addr_postal: 17000,
  addr_country_code: 'CZ',
  vTxtClr: '#ffffff',
  vBgClr: '#000000',
  
  gLabel: 'balety',
  note: 'balet je o baletu a taky o batoletech',
  gTxtClr: '#000000',
  gBgClr: '#ec5dee',
  
  users: [
    {
      id: 1,
      login: 'admin',
      f_name: 'Vojtěch',
      l_name: 'Divoký',
      email: 'divokyvojta@gmail.com',
      phone: 722680481,
      id_role: 1
    },
    {
      id: 1,
      login: 'admin',
      f_name: 'Vojtěch',
      l_name: 'Divoký',
      email: 'divokyvojta@gmail.com',
      phone: 722680481,
      id_role: 3
    }
  ],
  
  _rendered: true,
  daySpan: 2
} -->

<div
	style="--rows: {event.daySpan}; --bgClr: {event.bgClr}; --txtClr: {event.txtClr};"
	title={event.note}
>
	{event.label}
</div>

<style>
	div {
		display: flex;
		grid-column: span 1;

		align-items: center;
		justify-content: center;
		text-align: center;

		grid-row: span var(--rows);
		background-color: var(--bgClr);
		color: var(--txtClr);
	}
</style>
