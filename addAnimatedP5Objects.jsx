﻿{    // addAnimatedP5Objects    //    // Script that can handle an XML feed with animation data from Processing (See accompanied P5 sketch)    // All objects that are stored into the XML file get transferred into AE shape layers (ellipses in this case)    //  The animation data gets converted into animation keyframes within AE.    //    // AE script created by Mick van Olst (POPSURE) and P5 XML export sketch created by João Fonseca.    // Facilitated by onformative Berlin.    //    // June 2014    //    	function addAnimatedP5Objects(thisObj)	{		var scriptName = "Add a bunch of objects with keyframe data";				// main:		//				if(parseFloat(app.version) < 4)		{			alert("Time for a new AE version buddy", scriptName);			return;		}		else		{             var xmlLocation = File.openDialog("Select the object XML file...", "XML:*.xml", false);                          if (xmlLocation)             {                 xmlLocation.open("r");                 var xmlString = xmlLocation.read();                 var myXML = new XML(xmlString);                                  // ok we got the xml, let's set the general settings                 var cWidth = parseInt(parseFloat(myXML.general.scene.@width));                 var cHeight = parseInt(myXML.general.scene.@height);                 var cFramerate = parseFloat(myXML.general.scene.@framerate);                 var totFrames = parseInt(myXML.general.scene.@frame_duration);                                  // grabbing project                 var currentProject = app.project;			                 // Creating comp                 // we need to know the time in seconds for the duration,                 var totSecs = totFrames / cFramerate;                                 var compSettings	= cs = [cWidth, cHeight, 1, totSecs, cFramerate]                 $.writeln(compSettings);                 var defaultCompName = "Generated via Processing";                 var currentComp     = currentProject.items.addComp(defaultCompName, cs[0], cs[1], cs[2], cs[3], cs[4]);                 currentComp.openInViewer();                                 // here we'll iterate through all the objects                 parseXML(currentComp, myXML);                 xmlLocation.close();              } else {                  alert("could not open the XML file");              }		}	}    function parseXML(thisObj, data)    {        // iterating through all the objects        //$.writeln(data.objects.length());        var numObjs = data.objects.object.length();        for(var i = 0; i < numObjs; i++)         {            $.writeln(data.objects.object[i].id);            var w = parseInt(data.objects.object[i].@width);            var h = parseInt(data.objects.object[i].@height);            var type = data.objects.object[i].@type;            var c = [parseFloat(data.general.colors.color. (@type == type).@red), parseFloat(data.general.colors.color. (@type == type).@green), parseFloat(data.general.colors.color. (@type == type).@blue)];            $.writeln(c);                        if(c[0] > 0) {                c[0] = c[0] / 255 * 1;            }            if(c[1] > 0) {                c[1] = c[1] / 255 * 1;            }            if(c[2] > 0) {                c[2] = c[2] / 255 * 1;            }                     // iterate through each keyframe and store it's info into an array            var number = [];            var anchorPointX = [];            var anchorPointY = [];            var positionX = [];            var positionY = [];            var scaleX = [];            var scaleY = [];            var rotation = [];            var numKeys = data.objects.object[i].keyframes.frame.length();            var framerate = parseFloat(data.general.scene.@framerate);            for(var j = 0; j < numKeys; j++) {                number.push(parseInt(data.objects.object[i].keyframes.frame[j].@number));                anchorPointX.push(parseFloat(data.objects.object[i].keyframes.frame[j].anchor_point.@x));                anchorPointY.push(parseFloat(data.objects.object[i].keyframes.frame[j].anchor_point.@y));                positionX.push(parseFloat(data.objects.object[i].keyframes.frame[j].position.@x));                positionY.push(parseFloat(data.objects.object[i].keyframes.frame[j].position.@y));                scaleX.push(parseFloat(data.objects.object[i].keyframes.frame[j].scale.@x_perc));                scaleY.push(parseFloat(data.objects.object[i].keyframes.frame[j].scale.@y_perc));                rotation.push(parseFloat(data.objects.object[i].keyframes.frame[j].rotation.@deg));                         }            createObject (thisObj, w, h, c, number, anchorPointX, anchorPointY, positionX, positionY, scaleX, scaleY, rotation, framerate, type);                    }    }		function createObject(thisObj, w, h, c, number, anchorPointX, anchorPointY, positionX, positionY, scaleX, scaleY, rotation, framerate, type)	{		var currentComp = thisObj;		var myEllipseSize = [w,h];		var myFillColor = c; 		var myShapeLayer = currentComp.layers.addShape();                  var numLabel = 0;         if(type == "A") {            numLabel = 1;         } else if(type == "B") {             numLabel = 2;         } else if(type == "C") {             numLabel = 3;         } else if(type == "D") {             numLabel = 4;         } else if(type == "E") {             numLabel = 5;         }         myShapeLayer.label = numLabel;         // add the keyframes         for(var i=0; i < number.length; i++)          {             var myProperty = myShapeLayer.position;             var t = 0.0;             if(number[i] > 0) {                 t = number[i]/framerate;             }            myProperty.setValueAtTime(t, [positionX[i],positionY[i]]);         }        		var myShapeLayerContents = myShapeLayer.property("ADBE Root Vectors Group");		var myShapeGroup = myShapeLayerContents.addProperty("ADBE Vector Group");		var myEllipse = myShapeGroup.property("ADBE Vectors Group").addProperty("ADBE Vector Shape - Ellipse");		myEllipse.property("ADBE Vector Ellipse Size").setValue(myEllipseSize);		var myShapeFill = myShapeGroup.property("ADBE Vectors Group").addProperty("ADBE Vector Graphic - Fill");		myShapeFill.property("ADBE Vector Fill Color").setValue(myFillColor);			}		addObjects(this);}