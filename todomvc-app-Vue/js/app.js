(function (window) {
	'use strict';

	// Your starting point. Enjoy the ride!
	// const todos = [
					// {
					// 	id:1,
					// 	title:'eat',
					// 	completed:true
					// },
					// {
					// 	id:2,
					// 	title:'class',
					// 	completed:false
					// },
					// {
					// 	id:3,
					// 	title:'coding',
					// 	completed:false
					// }
				// ]

	window.vueApp = new Vue({
		el:'#app',
		data: {
			todos:JSON.parse(window.localStorage.getItem('todos') ||'[]'),
			currentEditing:null,
			filterText:'all'
		},
		methods:{
			handleNewTodKeyDown:function(e){
				//0.Register enter event
				//1.Obtain text contents
				//2.Verify data
				//3.Add data in totos list
				const value = e.target.value
				if(!value.length){
					return 
				}
				const todos = this.todos
				todos.push({
					id:todos.length==0?0:todos[todos.length-1].id+1,
					title:value,
					completed:false
				})				
				e.target.value=""
			},
			handleToggleAllChagne:function(e){
				//0.Combine checkbox event
				//1.Obtain checkbox status
				//3.Loop state and assign value to true
				const checked = e.target.checked
				this.todos.forEach( item => {
						item.completed = checked
					}
				)				
			},
			handleRemoveTodoClick:function(index, ev){
				this.todos.splice(index, 1)
			},
			handleGetEditingDblcilck:function(item){
				this.currentEditing = item
			},
			handleSaveEditKeydown:function(item, index, ev){
				
				const value = ev.target.value.trim()
				if(!value.length){
					this.todos.splice(index, 1)
				} else {
					item.title = value
					this.currentEditing = null
				}

			},
			handleCancelEditeEsc:function(){
				this.currentEditing = null
				
			},
			handleClearAllDoneClick:function(){
				//Don't delete array item in forEach (error method)
				// this.todos.forEach((items, index) => {
				// 		if (items.completed) {
				// 			this.todos.splice(index, 1)
				// 		}
				// 	}
				// )

				// A way/method (Manual control index)
				// for(let i=0; i<this.todos.length; i++){
				// 	if (this.todos[i].completed) {
				// 		this.todos.splice(i, 1)
				// 		i--
				// 	}
				// }

				//Another method(Filter results)
				// this.todos = this.todos.filter(t => {return t.completed == false})
				// this.todos = this.todos.filter(t => (t.completed == false))
				this.todos = this.todos.filter(t => !t.completed)				
			}
		},
		//Putting too much logic into the template makes the template difficult to maintain
		//1.Reduce template logic.
		//2.Use cache to improve performance issues.
		//3.Cannot be used for event handlers.
		computed:{
			//Shorthand
			//  remaningCount:function(){
			//  	return this.todos.filter(todos => !todos.completed).length
			// }
			remaningCount:{
				get(){
					return this.todos.filter(todos => !todos.completed).length
				},
				//Note: This is just to demonstrate the grammar.
				set(){
				}
			},
			//The computed attribute knows that he depends on todos. When the todos changes, the computed attribute is compute.
			toggleAllStat:{
				get(){
					return this.todos.every(t =>t.completed)
				},
				set(){
					const checked = !this.toggleAllStat
					this.todos.forEach(item =>{
							item.completed = checked
						}
					)
				}
			},
			filterTodos(){
				//If select All return this.todos.
				//if select Active return this.todos.filter(t =>!t.completed).
				//if select completed return this.todos.filter(t =>t.completed).
				switch (this.filterText) {
					case 'active':
						return this.todos.filter(t =>!t.completed)						
						break;
					case 'completed':
						return this.todos.filter(t =>t.completed)
						break;
					default:
						return this.todos				
						break;
				}
			}
		},
		watch: {
			//Monitor todos changes, do business custom processing when todos changes.
			//Reference types can only monitor one level and cannot monitor changes to child members of internal members.
			todos:{
				//val is the atest value after change.
				handler(val, oldVal){
					console.log(oldVal[0], val[0])
					//Storage data
					//Can be accessed via this.todos or via val to get the latest todos.
					window.localStorage.setItem('todos',JSON.stringify(this.todos))
					console.log("bianle")
				},
				deep: true,//Deep monitoring, the only way to monitor changes to arrays or objects.			
				// immediate: true
			}
		}
	})

	// //注册hash（锚点） 的改变事件
	// //该事件只有change才会执行，页面初始化不会执行
	// window.onhashchange = function(){
	// 	vueApp.filterText = window.location.hash.substr(2)
	// }
	// //页面初始化的时候调用一次，保持路由状态
	// window.onhashchange()

	window.onhashchange = handlehashchange
	handlehashchange()
	function handlehashchange(){
		vueApp.filterText = window.location.hash.substr(2)
	}

})(window);
