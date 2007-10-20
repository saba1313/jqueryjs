﻿import flash.net.FileReferenceList;
import flash.net.FileReference;
import flash.external.ExternalInterface;
import Uploader.Delegate;

/**
 * Uploader (based upon SWFUpload, with authors Lars Huring and Olov Nilzén)
 * @author Gilles van den Hoven <www.webunity.nl>
 * @version 0.31 (2007-10-20 11:08)
 */
class Uploader.UploaderBackend {
	// Private variables
	private var listener:Object = new Object();
	private var fileList:FileReferenceList;
	private var fileMask:Array;
	private var controlId:Number;
	private var iCurrentFile:Number;
	private var fileQueue:Array;
	private var qbDone:Number;
	private var qbTotal:Number;
	private var qtStart:Number;
	private var qtRemain:Number;

	// Public variables
	private var movieID:String;
	private var fileMasks:String;
	private var maxFilesize:Number;
	private var maxQueueSize:Number;
	private var maxQueueCount:Number;
	private var backendScript:String;

	/**
	 * Constructor
	 */
	static function main() {
		var Uploader:UploaderBackend = new UploaderBackend();
	};

	/**
	 * Initialize class.
	 * @return {Void}
	 */
	function UploaderBackend() {
		// Get flashvars
		movieID = _root.movieID;
		fileMasks = _root.fileMasks;
		maxFilesize = _root.maxFilesize;
		maxQueueSize = _root.maxQueueSize;
		maxQueueCount = _root.maxQueueCount;
		backendScript = _root.backendScript;

		// Security fix
		System.security.allowDomain("*");

		// set fileList events
		listener.onCancel = Delegate.create(this, uploadCancel);
		listener.onComplete = Delegate.create(this, uploadComplete);
		listener.onProgress = Delegate.create(this, uploadProgress);
		listener.onHTTPError = Delegate.create(this, uploadHTTPError);
		listener.onIOError = Delegate.create(this, uploadIOError);
		listener.onSecurityError = Delegate.create(this, uploadSecurityError);
		listener.onSelect = Delegate.create(this, uploadSelect);
		fileList = new FileReferenceList()
		fileList.addListener(listener);

		// Expose external functions
		ExternalInterface.addCallback("browseForFiles", this, browseForFiles);
		ExternalInterface.addCallback("queueUploadNext", this, queueUploadNext);
		ExternalInterface.addCallback("fileCancel", this, fileCancel);
		ExternalInterface.addCallback("queueCancel", this, queueCancel);

		// Split filemask
		fileMask = new Array();
		var arrTemp1:Array;
		var arrTemp2:Array;
		if (fileMasks.indexOf('||')) {
			arrTemp1 = fileMasks.split('||');
		} else {
			arrTemp1 = [fileMasks];
		}

		// Build filemask
		for (var i:Number = 0; i < arrTemp1.length; i++) {
			arrTemp2 = arrTemp1[i].split('|', 2);
			fileMask.push({ description: arrTemp2[0] , extension: arrTemp2[1] });
		}

		// Call home to ET
		ExternalInterface.call('$.ui.upload.callback', 'swfLoaded', this.movieID, (backendScript.length == 0) ? false : true);

		// Start a new FileReferenceList
		this.resetObject();
	};

	/**
	 * Reset all needed functions
	 */
	private function resetObject() {
		// Generate unique ID
		controlId = Math.floor(Math.random() * 10000) + 1;

		// Empty the filequeue
		fileQueue = new Array();

		// Reset the current file
		iCurrentFile = -1;

		// Reset the bytes processed and current file size
		qbDone = 0;
		qbTotal = 0;
		qtStart = -1;
	};

	/**
	 * Returns the props for current file
	 * @param	oData
	 * @return
	 */
	private function getDataObject(oData:Object):Object {
		return {
				id: oData.sID,							// ID of this file
				name: oData.oFile.name,					// Filename
				type: oData.oFile.type,					// Contenttype
				size: oData.oFile.size,					// Filesize
				ctime: oData.oFile.creationDate,		// Creation time
				mtime: oData.oFile.modificationDate,	// Modification time
				creator: oData.oFile.creator			// Creator of the file
			};
	};

	/**
	 * Returns only the statistics for the progress
	 * @param	oData
	 * @return
	 */
	private function getProgressObject(oData:Object, cbDone:Number, cbTotal:Number):Object {
		var oProgress:Object;
		oProgress = {
				cbDone: cbDone,					// File: Bytes allready processed
				cbTotal: cbTotal,				// File: Filesize
				cbRemain: 0,					// File: Bytes remaining
				ctStart: oData.ctStart,			// File: Starttime
				ctBusy: 0,						// File: Milliseconds busy
				cbSpeed: 0,						// File: speed
				ctRemain: 0,					// File: Seconds remaining
				cProgress: 0,					// File: progress
				qIndex: (iCurrentFile + 1),		// Queue: Current index
				qCount: fileQueue.length,		// Queue: length of queue
				qbDone: this.qbDone + cbDone,	// Queue: Bytes allready processed
				qbTotal: this.qbTotal,			// Queue: Filesize
				qbRemain: 0,					// Queue: Bytes remaining
				qtStart: this.qtStart,			// Queue: Starttime
				qtBusy: 0,						// Queue: Milliseconds busy
				qbSpeed: 0,						// Queue: speed
				qtRemain: 0,					// Queue: Seconds remaining
				qProgress: 0					// Queue: progress
			};

		// Prevent out of bound number
		if (oProgress.qIndex > oProgress.qCount) {
			oProgress.qIndex = oProgress.qCount;
		}

		// Perform calculations (on file level)
		oProgress.cbRemain = (oProgress.cbTotal - oProgress.cbDone);
		oProgress.ctBusy = Math.floor((getTimer() - oProgress.ctStart) / 1000);
		if (oProgress.ctBusy > 0) {
			oProgress.cbSpeed = (oProgress.cbDone / oProgress.ctBusy);
			oProgress.ctRemain = Math.ceil(oProgress.cbRemain / oProgress.cbSpeed);
		} else {
			oProgress.cbSpeed = oProgress.cbTotal;
		}
		oProgress.cProgress = Math.round((oProgress.cbDone / oProgress.cbTotal) * 100);

		// Perform calculations (on queue level)
		oProgress.qbRemain = (oProgress.qbTotal - oProgress.qbDone);
		oProgress.qtBusy = Math.floor((getTimer() - oProgress.qtStart) / 1000);
		if (oProgress.qtBusy > 0) {
			oProgress.qbSpeed = (oProgress.qbDone / oProgress.qtBusy);
			oProgress.qtRemain = Math.ceil(oProgress.qbRemain / oProgress.qbSpeed);
		} else {
			oProgress.cbSpeed = oProgress.qbTotal;
		}
		oProgress.qProgress = Math.round((oProgress.qbDone / oProgress.qbTotal) * 100);

		// Return the calculated values
		return oProgress;
	};

	/**
	 * Checks if the filesize is smaller than the maximum allowed filesize.
	 * @param {FileReference} file Reference to the file.
	 * @return {Boolean}
	 */
	private function checkFilesize(oData:Object):Boolean {
		return (maxFilesize > 0) ? (oData.oFile.size < (maxFilesize * 1024)) : true;
	};

	/**
	 * Checks if the filesize is smaller than the maximum allowed queuesize.
	 * @param {FileReference} file Reference to the file.
	 * @return {Boolean}
	 */
	private function checkQueueSize(oData:Object):Boolean {
		return (maxQueueSize > 0) ? ((qbTotal + oData.oFile.size) < (maxQueueSize * 1024)) : true;
	};


	/**
	 * Open the file-browsing dialog box with allowed filetypes.
	 * @return {Void}
	 */
	private function browseForFiles():Void {
		// Callback to show greybox or something
		ExternalInterface.call('$.ui.upload.callback', 'dialogPreShow', this.movieID);

		// Show the dialog
		fileList.browse(fileMask);
	};

	/**
	 * @method uploadCancel
	 * @description Invoked when the user dismisses the file-browsing dialog box.
	 * @return {Void}
	 */
	private function uploadCancel():Void {
		ExternalInterface.call('$.ui.upload.callback', 'dialogPostShow', this.movieID, false);
	};

	/**
	 * Invoked when the user selects a file to upload from the file-browsing dialog box.
	 * @param {FileReference} file Reference to the file uploading.
	 * @return {Void}
	 */
	public function uploadSelect(fileRefList:FileReferenceList):Void {
		var oTemp:Object;
		var bFilesizeOk:Boolean;
		var bQueueSizeOk:Boolean;
		var bQueueCountOk:Boolean;

		// Callback to hide greybox or summit like that ;)
		ExternalInterface.call('$.ui.upload.callback', 'dialogPostShow', this.movieID, true);

		// Loop through all files in fileList
		var fileListArray:Array = fileRefList.fileList;
		for (var i:Number = 0; i < fileListArray.length; i++) {
			// Generate object from chosen file
			oTemp = {
						sID: controlId.toString() + "_" + fileQueue.length.toString(),
						oFile: fileListArray[i],
						ctStart: 0
					};

			// Check for errors 
			bFilesizeOk = checkFilesize(oTemp);
			bQueueSizeOk = checkQueueSize(oTemp);
			bQueueCountOk = ((maxQueueCount != -1) && ((fileQueue.length + 1) > maxQueueCount)) ? false : true;
			if  (!bQueueCountOk || !bQueueSizeOk || !bFilesizeOk) {
				var oData:Object = getDataObject(oTemp);
				var oProgress:Object = getProgressObject(oTemp, 0, oTemp.size);

				// Queue is full
				if (!bQueueCountOk) {
					ExternalInterface.call('$.ui.upload.callback', 'queueErrorCount', this.movieID, oData, oProgress);
					return; // Stop trying to add other files, queue is full!
				}
				
				// File was to BIG
				if (!bFilesizeOk) {
					ExternalInterface.call('$.ui.upload.callback', 'fileErrorSize', this.movieID, oData, oProgress);
					continue;
				}
				
				// File did not fit into the current queue
				if (!bQueueSizeOk) {
					ExternalInterface.call('$.ui.upload.callback', 'queueErrorSize', this.movieID, oData, oProgress);
					continue;
				}
			}

			// Add the size from this file to the total to process bytes.
			qbTotal+= oTemp.oFile.size;

			// Add file to queue
			fileQueue.push(oTemp);

			// Phone home
			var oData:Object = getDataObject(oTemp);
			var oProgress:Object = getProgressObject(oTemp, 0, oTemp.size);
			ExternalInterface.call('$.ui.upload.callback', 'fileAdded', this.movieID, getDataObject(oTemp));
		};
	};

	/**
	 * Cancel the file upload with specified id.
	 * @param {String} id Id for the file.
	 * @return {Void}
	 */
	public function fileCancel(sWhich:String):Void {
		for (var i = 0; i < fileQueue.length; i++) {
			if (fileQueue[i].sID == sWhich) {
				var oData:Object = getDataObject(fileQueue[i]);
				var oProgress:Object = getProgressObject(oData, 0, fileQueue[i].oFile.size);

				// Remove the size from this file from the total to process bytes.
				qbTotal-= fileQueue[i].oFile.size;

				// Cancel upload
				if (fileQueue[i].ctStart != 0) {
					fileQueue[i].oFile.cancel();

					// Call home E.T.
					ExternalInterface.call('$.ui.upload.callback', 'fileCancelled', this.movieID, oData, oProgress);
				} else {
					ExternalInterface.call('$.ui.upload.callback', 'fileRemoved', this.movieID, oData, oProgress);
				}

				// Remove it from the queue
				delete fileQueue[i];
			}
		}
	};

	/**
	 * Start the upload.
	 * @return {Void}
	 */
	private function queueUploadNext():Void {
		// Check for empty queue
		if (iCurrentFile == -1) {
			if (fileQueue.length > 0) {
				// Start upload
				qtStart = getTimer();

				// Empty queue
				ExternalInterface.call('$.ui.upload.callback', 'queueStarted', this.movieID);
			} else {
				// Empty queue
				ExternalInterface.call('$.ui.upload.callback', 'queueEmpty', this.movieID);
				return;
			}
		}

		// Get the next file to upload
		if (iCurrentFile <= fileQueue.length) {
			// Increase current file pointer
			iCurrentFile++;

			// Get file
			if (!FileReference(fileQueue[iCurrentFile].oFile)) {
				// Increase counter if current file is not valid
				queueUploadNext();
			}
		} else {
			// Call home to ET
			ExternalInterface.call('$.ui.upload.callback', 'queueCompleted', this.movieID);

			// Reset the filequeue
			this.resetObject();

			return;
		}

		// Call home E.T. - file obj, file count & file queue length
		var oData:Object = getDataObject(fileQueue[iCurrentFile]);
		var oProgress:Object = getProgressObject(fileQueue[iCurrentFile], 0, fileQueue[iCurrentFile].oFile.size);
		ExternalInterface.call('$.ui.upload.callback', 'fileStarted', this.movieID, oData, oProgress);

		// Get timer
		fileQueue[iCurrentFile].ctStart = getTimer();

		// Add listener
		fileQueue[iCurrentFile].oFile.addListener(listener);

		// Start upload
		fileQueue[iCurrentFile].oFile.upload(backendScript);
	};

	/**
	 * @method uploadProgress
	 * @description Invoked periodically during the file upload.
	 * @param {FileReference} file The FileReference object that initiated the operation.
	 * @param {Number} currentBytesProcessed The number of bytes transmitted so far.
	 * @param {Number} currentFilesize The total size of the file to be transmitted, in bytes.
	 * @return {Void}
 	 */
	private function uploadProgress(file:FileReference, bytesLoaded:Number, bytesTotal:Number):Void  {
		var oData:Object = getDataObject(fileQueue[iCurrentFile]);
		var oProgress:Object = getProgressObject(fileQueue[iCurrentFile], bytesLoaded, bytesTotal);
		ExternalInterface.call('$.ui.upload.callback', 'fileProgress', this.movieID, oData, oProgress);
	};

	/**
	 * Invoked when the upload operation has successfully completed.
	 * @param {FileReference} file The FileReference object that initiated the operation.
	 * @return {Void}
	 */
	private function uploadComplete(file:FileReference):Void {
		// Get objects
		var oData:Object = getDataObject(fileQueue[iCurrentFile]);
		var oProgress:Object = getProgressObject(fileQueue[iCurrentFile], file.size, file.size);

		// Add this size to the size which was sent to the backend
		qbDone+= file.size;

		// Phone home
		ExternalInterface.call('$.ui.upload.callback', 'fileCompleted', this.movieID, oData, oProgress);

		// Process next file
		queueUploadNext();
	};

	/**
	 * Invoked when an input error occurs.
	 * @param {FileReference} file The FileReference object that initiated the operation.
	 * @return {Void}
	 */
	private function uploadIOError(file:FileReference):Void {
		// Remove the size from this file from the total to process bytes.
		qbTotal-= file.size;

		// Phone home
		var oData:Object = getDataObject(fileQueue[iCurrentFile]);
		var oProgress:Object = getProgressObject(oData, 0, fileQueue[iCurrentFile].oFile.size);
		ExternalInterface.call('$.ui.upload.callback', 'fileErrorIO', this.movieID, oData, oProgress);

		// Process next file
		queueUploadNext();
	};

	/**
	 * Invoked when an upload fails because of an HTTP error
	 * @param {FileReference} file The File Reference object that initiated the operation.
	 * @param {Number} httpError The HTTP error that caused this upload to fail.
	 * @return {Void}
	 */
	private function uploadHTTPError(file:FileReference, httpError:Number):Void {
		// Remove the size from this file from the total to process bytes.
		qbTotal-= file.size;

		// Phone home
		var oData:Object = getDataObject(fileQueue[iCurrentFile]);
		var oProgress:Object = getProgressObject(oData, 0, file.size);
		ExternalInterface.call('$.ui.upload.callback', 'fileErrorHTTP', this.movieID,  oData, oProgress, httpError);

		// Process next file
		queueUploadNext();
	};

	/**
	 * Invoked when an upload fails because of a security error.
	 * @param {FileReference} file The FileReference object that initiated the operation.
	 * @param {String} errorString Describes the error that caused onSecurityError to be called.
	 * @return {Void}
	 */
	private function uploadSecurityError(file:FileReference, errorString:String):Void {
		// Remove the size from this file from the total to process bytes.
		qbTotal-= file.size;

		// Phone home
		var oData:Object = getDataObject(fileQueue[iCurrentFile]);
		var oProgress:Object = getProgressObject(oData, 0, file.size);
		ExternalInterface.call('$.ui.upload.callback', 'fileErrorSecurity', this.movieID,  oData, oProgress, errorString);

		// Process next file
		queueUploadNext();
	};

	/**
	 * Cancel the whole remaining upload queue.
	 * @return {Void}
	 */
	private function queueCancel():Void {
		if (fileQueue.length > 0) {
			// Loop from current position in queue
			for (var i = iCurrentFile; i < fileQueue.length; i++) {
				// Check file pointer
				if (FileReference(fileQueue[i].oFile)) {
					var oData:Object = getDataObject(fileQueue[i]);
					var oProgress:Object = getProgressObject(oData, 0, fileQueue[i].oFile.size);

					// Remove the size from this file from the total to process bytes.
					qbTotal-= fileQueue[i].oFile.size;

					// Cancel upload
					if (fileQueue[i].ctStart != 0) {
						fileQueue[i].oFile.cancel();

						// Call home E.T.
						ExternalInterface.call('$.ui.upload.callback', 'fileCancelled', this.movieID, oData, oProgress);
					} else {
						ExternalInterface.call('$.ui.upload.callback', 'fileRemoved', this.movieID, oData, oProgress);
					}
				}
			}
		}

		// Call home to ET
		ExternalInterface.call('$.ui.upload.callback', 'queueCancelled', this.movieID);

		// Reset the filequeue
		this.resetObject();
	};
}