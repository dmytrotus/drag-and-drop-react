import React from 'react';
import ReactDOM from 'react-dom';
import '@atlaskit/css-reset';
import { DragDropContext } from 'react-beautiful-dnd';
import initialData from './initial-data';
import Column from './column';
import styled from 'styled-components';

const Container = styled.div`
	display:flex;
`;

class App extends React.Component{
	state = initialData;

	onDragStart = () => {
		document.body.style.color = 'orange';
	};



	onDragEnd = result => {

		document.body.style.color = 'inherit';

		const { destination, source, draggableId } = result;
		if(!destination) {
			return;
		}

		if(
			destination.droppableId == source.droppableId &&
			destination.index == source.index
		) {
			return;
		}

		const column = this.state.columns[source.droppableId];
		const newTaskIds = Array.from(column.taskIds);
		newTaskIds.splice(source.index, 1);
		newTaskIds.splice(destination.index, 0, draggableId);

		const newColumn = {
			...column,
			taskIds: newTaskIds,
		};

		const newState = {
			...this.state,
			columns: {
				...this.state.columns,
				[newColumn.id]: newColumn,
			},
		};

		this.setState(newState);
	};

	render(){
		return (
			<DragDropContext
			onDragStart={this.onDragStart}
			onDragUpdate={this.onDragUpdate}

			//onDragEnd Is Required
			onDragEnd={this.onDragEnd}>
			<Container>
		{this.state.columnOrder.map((columnId) => {
			const column = this.state.columns[columnId];
			const tasks = column.taskIds.map(taskId => this.state.tasks[taskId]);

			return <Column key={column.id} column={column} tasks={tasks} />
		})}
			</Container>
			</DragDropContext>
		);
	}
}

ReactDOM.render(<App />, document.getElementById('root'));
