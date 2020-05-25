import React, { Component } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import _ from 'lodash'
import {Categories} from '../initialSolution/pilas-bloques-blocks'
import { Col, Row, Container } from "react-bootstrap";

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
    userSelect: 'none',
    padding: grid,
    margin: `0 0 ${grid}px 0`,
    color: "white",
    textAlign: "center",
    background: 'purple',
    borderRadius: "10px",

    ...draggableStyle
});

const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? 'lightblue' : 'white',
    borderWidth: "1px",
    borderColor: "Gainsboro",
    borderRadius:"5px",
    borderStyle: "solid",
    padding: grid,
    width: 250
});

export default class BlockSelector extends Component {
    constructor(props){
        super(props);
        const permittedCategoriesFromLevel = this.props.level.categoriesPermitted;
        const blocks = Categories.map(({ name }) => ({ id: name, content: <h5>{name}</h5> }));
        const [categoriesNotPermitted, categoriesPermitted] = _.partition(blocks, ({id}) => permittedCategoriesFromLevel.includes(id));

        this.state = {
            items: categoriesPermitted,
            selected: categoriesNotPermitted
        };
    }
    state = {
            items: Categories.map(({ name }) => ({ id: name, content: <h1>{name}</h1> })),
            selected: []
        };

    id2List = {
        droppable: 'items',
        droppable2: 'selected'
    };

    getList = id => this.state[this.id2List[id]];

    onDragEnd = result => {
        const { source, destination } = result;
        // dropped outside the list
        if (!destination) {
            return;
        }

        if (source.droppableId === destination.droppableId) {
            const items = reorder(
                this.getList(source.droppableId),
                source.index,
                destination.index
            );
            let state = {items};
            if (source.droppableId === 'droppable2') {
                state = { selected: items };
            }

            this.setState(state);
        } else {
            const result = move(
                this.getList(source.droppableId),
                this.getList(destination.droppableId),
                source,
                destination
            );

            this.setState({
                items: result.droppable,
                selected: result.droppable2
            });
        }
    };
    isValidated(){
        const permittedCategories = this.state.selected;
        this.props.onUpdateProps({categoriesPermitted: permittedCategories.map(bloque => bloque.id)});
        return !_.isEmpty(permittedCategories)
    }
    render() {
        return (
            <Container>
            <Row>
            <Col md={12}>
            <h1>Selector de bloques</h1>
            <div>Seleccioná las categorías de bloques que estarán disponibles en el nivel</div>
            <br/>
                <div style={{display: 'flex','justify-content':'space-evenly'}}>
                    <div style={{width: '50%','text-align': 'center'}}>
                        <h4>Categorías disponibles</h4>
                    </div>
                    <div style={{width: '50%','text-align': 'center'}}>
                        <h4>Categorías bloqueadas para el nivel</h4>
                    </div>
                </div>

                <div style={{display: 'flex','justify-content':'space-evenly', 'min-height': "26em"}}>
                    <DragDropContext onDragEnd={this.onDragEnd}>
                        <DroppableList id="droppable2" list={this.state.selected}   getListStyle={getListStyle} getItemStyle={getItemStyle}/>
                        <DroppableList id="droppable"  list={this.state.items} getListStyle={getListStyle} getItemStyle={getItemStyle}/>
                    </DragDropContext>
                </div>
            </Col> 
            </Row>
            </Container>
        );
    }
}

const DroppableList = ({id, list, getListStyle, getItemStyle}) => (<Droppable droppableId={id}>
    {(provided, snapshot) => (
        <div
            ref={provided.innerRef}
            style={getListStyle(snapshot.isDraggingOver)}>
            {list.map((item, index) => (
                <Draggable
                    key={item.id}
                    draggableId={item.id}
                    index={index}>
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={getItemStyle(
                                snapshot.isDragging,
                                provided.draggableProps.style
                            )}>
                            {item.content}
                        </div>
                    )}
                </Draggable>
            ))}
            {provided.placeholder}
        </div>
    )}
    </Droppable>)
