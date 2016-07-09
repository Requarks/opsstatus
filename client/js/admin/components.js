
// ====================================
// Components
// ====================================

if($('#admin-components').length) {

	// Sortable lists

	if($('#admin-components > .admin-headlist').length) {
		var compgroupsList = Sortable.create($('#admin-components > .admin-headlist').get(0), {
			group: 'master',
			animation: 300,
			chosenClass: 'active',
			handle: '.handle',
			onEnd: (ev) => {
				$.ajax('/admin/componentgroups', {
	  			dataType: 'json',
	  			method: 'POST',
	  			data: {
	  				groupsOrder: JSON.stringify(compgroupsList.toArray())
	  			}
	  		}).then((res) => {
	  			if(res.ok === true) {
	  				alerts.pushSuccess('New order saved.', 'The groups sort order has been saved.');
	  			} else {
	  				alerts.pushError('Re-ordering failed.', 'Could not re-order groups. Try again later.');
	  			}
	  		}, () => {
	  			alerts.pushError('Connection error', 'An unexpected error when connecting to the server.');
	  		});
			}
		});
		var compsList = _.map($('#admin-components > .admin-headlist .admin-list'), (grp) => {
			return Sortable.create(grp, {
				group: 'child',
				animation: 300,
				chosenClass: 'active',
				handle: '.handle',
				onEnd: (ev) => {
					return compOrderSave();
				},
				onAdd: (ev) => {
					return compOrderSave();
				}
			});
		});
	}
	if($('#admin-components > .admin-prelist').length) {
		var precompsList = Sortable.create($('#admin-components > .admin-prelist .admin-list').get(0), {
			group: { 
				name: 'child',
				pull: true,
				put: false
			},
			animation: 300,
			chosenClass: 'active',
			handle: '.handle'
		});

	}

	// Create New Component

	$('#admin-components-new').on('click', (ev) => {

		vex.dialog.open({
		  message: 'Enter the info of the new component:',
		  input: '<input name="name" type="text" placeholder="Component Name" autocomplete="off" pattern=".{3,}" required />' + 
		  			 '<input name="description" type="text" placeholder="Short description" autocomplete="off" pattern=".{5,}" required />',
		  callback(data) {

		  	if(_.isPlainObject(data)) {
		  		$.ajax('/admin/components', {
		  			dataType: 'json',
		  			method: 'PUT',
		  			data: {
		  				name: data.name,
		  				description: data.description
		  			}
		  		}).then((res) => {
		  			if(res.ok === true) {
		  				window.location.reload(true);
		  			} else {
		  				alerts.pushError('Could not create component', 'Invalid component name.');
		  			}
		  		}, () => {
		  			alerts.pushError('Connection error', 'An unexpected error when connecting to the server.');
		  		});
		  	}

		  }
		});

	});

	// Create New Component Group

	$('#admin-components-newgroup').on('click', (ev) => {

		vex.dialog.open({
		  message: 'Enter the info of the new component group:',
		  input: '<input name="name" type="text" placeholder="Component Group Name" autocomplete="off" pattern=".{2,255}" required />' + 
		  			 '<input name="shortname" type="text" placeholder="Component Group Short Name" autocomplete="off" pattern=".{2,20}" required />',
		  callback(data) {

		  	if(_.isPlainObject(data)) {
		  		$.ajax('/admin/componentgroups', {
		  			dataType: 'json',
		  			method: 'PUT',
		  			data: {
		  				name: data.name,
		  				shortname: data.shortname
		  			}
		  		}).then((res) => {
		  			if(res.ok === true) {
		  				window.location.reload(true);
		  			} else {
		  				alerts.pushError('Could not create component group', 'Invalid component group name.');
		  			}
		  		}, () => {
		  			alerts.pushError('Connection error', 'An unexpected error when connecting to the server.');
		  		});
		  	}

		  }
		});

	});

	// Edit existing Region

	$('#admin-components > .admin-headlist > li > h2 .edit-action').on('click', (ev) => {

		let parentElm = $(ev.currentTarget).closest('li').get(0);

		vex.dialog.open({
		  message: 'Enter info for group ' + parentElm.dataset.name + ':',
		  input: '<input name="name" type="text" placeholder="Component Group Name" autocomplete="off" pattern=".{2,255}" value="' + parentElm.dataset.name + '" required />' + 
		  			 '<input name="shortname" type="text" placeholder="Component Group Short Name" autocomplete="off" pattern=".{2,20}" value="' + parentElm.dataset.shortname + '" required />',
		  callback(value) {

		  	if(!_.isEmpty(value)) {
		  		$.ajax('/admin/componentgroups', {
		  			dataType: 'json',
		  			method: 'POST',
		  			data: {
		  				editGroupId: parentElm.dataset.id,
		  				editGroupName: value.name,
		  				editGroupShortName: value.shortname
		  			}
		  		}).then((res) => {
		  			if(res.ok === true) {
		  				window.location.reload(true);
		  			} else {
		  				alerts.pushError('Edit Component Group failed', 'Could not edit group. Try again later.');
		  			}
		  		}, () => {
		  			alerts.pushError('Connection error', 'An unexpected error when connecting to the server.');
		  		});
		  	}

		  }
		});

	});

	// Delete a component group

	$('#admin-components > .admin-headlist > li > h2 .delete-action').on('click', (ev) => {

		let parentElm = $(ev.currentTarget).closest('li').get(0);

		vex.dialog.confirm({
		  message: 'Are you sure you want to delete component group ' + parentElm.dataset.name + '? All children components will be moved to Uncategorized.',
		  callback(value) {

		  	if(value) {
		  		$.ajax('/admin/componentgroups', {
		  			dataType: 'json',
		  			method: 'DELETE',
		  			data: {
		  				groupId: parentElm.dataset.id,
		  				groupName: parentElm.dataset.name
		  			}
		  		}).then((res) => {
		  			if(res.ok === true) {
		  				window.location.reload(true);
		  			} else {
		  				alerts.pushError('Delete component group failed', 'Could not delete component group. Try again later.');
		  			}
		  		}, () => {
		  			alerts.pushError('Connection error', 'An unexpected error when connecting to the server.');
		  		});
		  	}

		  }
		});

	});

}

let compOrderSave = _.debounce(() => {

	let orderData = {};
	_.forEach(compsList, (clist) => {
		let clistGroupId = $(clist.el).parent('li').get(0).dataset.id;
		orderData[clistGroupId] = clist.toArray();
	});

	$.ajax('/admin/components', {
		dataType: 'json',
		method: 'POST',
		data: {
			compsOrder: JSON.stringify(orderData)
		}
	}).then((res) => {
		if(res.ok === true) {
			alerts.pushSuccess('Components re-arranged', 'The new components sort order has been saved.');
		} else {
			alerts.pushError('Re-ordering failed.', 'Could not re-order components. Try again later.');
		}
	}, () => {
		alerts.pushError('Connection error', 'An unexpected error when connecting to the server.');
	});

}, 500);