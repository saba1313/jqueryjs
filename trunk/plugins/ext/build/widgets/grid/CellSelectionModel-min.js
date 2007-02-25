/*
 * Ext - JS Library 1.0 Alpha 2
 * Copyright(c) 2006-2007, Jack Slocum.
 * 
 * http://www.extjs.com/license.txt
 */

Ext.grid.CellSelectionModel=function(_1){Ext.apply(this,_1);this.selection=null;this.events={"beforecellselect":true,"cellselect":true,"selectionchange":true};this.textBuffer=[];};Ext.extend(Ext.grid.CellSelectionModel,Ext.grid.AbstractSelectionModel,{initEvents:function(){this.grid.on("mousedown",this.handleMouseDown,this);this.grid.container.on(Ext.isIE?"keydown":"keypress",this.handleKeyDown,this);var _2=this.grid.view;_2.on("refresh",this.onViewChange,this);_2.on("rowupdated",this.onRowUpdated,this);_2.on("beforerowremoved",this.clearSelections,this);_2.on("beforerowsinserted",this.clearSelections,this);if(this.grid.isEditor){this.grid.on("beforeedit",this.beforeEdit,this);}},beforeEdit:function(_3,_4,_5,_6,_7){this.select(_6,_7,false,true,_4);},onRowUpdated:function(v,_9,r){if(this.selection&&this.selection.record==r){v.onCellSelect(_9,this.selection.cell[1]);}},onViewChange:function(){this.clearSelections(true);},getSelectedCell:function(){return this.selection?this.selection.cell:null;},clearSelections:function(_b){this.clearBuffer();var s=this.selection;if(s){if(_b!==true){this.grid.view.onCellDeselect(s.cell[0],s.cell[1]);}this.selection=null;this.fireEvent("selectionchange",this,null);}},hasSelection:function(){return this.selection?true:false;},handleMouseDown:function(e,t){var v=this.grid.getView();if(this.isLocked()){return;}var row=v.findRowIndex(t);var _11=v.findCellIndex(t);if(row!==false&&_11!==false){this.select(row,_11);}},select:function(_12,_13,_14,_15,r){if(this.fireEvent("beforecellselect",this,_12,_13)!==false){this.clearSelections();r=r||this.grid.dataSource.getAt(_12);this.selection={record:r,cell:[_12,_13]};if(!_14){var v=this.grid.getView();v.onCellSelect(_12,_13);if(_15!==true){v.focusCell(_12,_13);}}this.fireEvent("cellselect",this,_12,_13);this.fireEvent("selectionchange",this,this.selection);}},isSelectable:function(_18,_19,cm){return !cm.isHidden(_19);},handleKeyDown:function(e){var g=this.grid,s=this.selection;if(e.isNavKeyPress()&&!s){e.stopEvent();var _1e=g.walkCells(0,0,1,this.isSelectable,this);if(_1e){this.select(_1e[0],_1e[1]);}return;}var sm=this;var _20=function(row,col,_23){return g.walkCells(row,col,_23,sm.isSelectable,sm);};var k=e.getKey(),r=s.cell[0],c=s.cell[1];var _27;switch(k){case e.TAB:if(e.shiftKey){_27=_20(r,c-1,-1);}else{_27=_20(r,c+1,1);}break;case e.DOWN:_27=_20(r+1,c,1);break;case e.UP:_27=_20(r-1,c,-1);break;case e.RIGHT:_27=_20(r,c+1,1);break;case e.LEFT:_27=_20(r,c-1,-1);break;case e.ENTER:if(g.isEditor&&!g.editing){g.startEditing(r,c);e.stopEvent();return;}break;default:if(g.isEditor&&!e.isNavKeyPress()){var ch=String.fromCharCode(e.getCharCode());if(ch){this.textBuffer.push(ch);if(!g.editing){g.startEditing(r,c,this.textBuffer);}}return;}}this.clearBuffer();if(_27){this.select(_27[0],_27[1]);e.stopEvent();}},clearBuffer:function(){this.textBuffer=[];},acceptsNav:function(row,col,cm){return !cm.isHidden(col)&&cm.isCellEditable(col,row);},onEditorKey:function(_2c,e){var k=e.getKey(),_2f,g=this.grid,ed=g.activeEditor;if(k==e.TAB){if(e.shiftKey){_2f=g.walkCells(ed.row,ed.col-1,-1,this.acceptsNav,this);}else{_2f=g.walkCells(ed.row,ed.col+1,1,this.acceptsNav,this);}e.stopEvent();}else{if(k==e.ENTER&&!e.ctrlKey){ed.completeEdit();e.stopEvent();}else{if(k==e.ESC){ed.cancelEdit();}}}if(_2f){g.startEditing(_2f[0],_2f[1]);}}});
