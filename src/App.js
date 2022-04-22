import "./App.css";
import React, { useRef, useState } from "react";
import EmailEditor from "react-email-editor";
import styled from "styled-components";
import sample from "./sample.json";
import axios from "axios";

const Container = styled.div`
	display: flex;
	flex-direction: column;
	position: relative;
	height: 100%;
`;

const Bar = styled.div`
	flex: 1;
	background-color: #0072ff;
	color: #ffffff;
	padding: 10px;
	display: flex;
	max-height: 40px;
	h1 {
		flex: 1;
		font-size: 16px;
		text-align: left;
	}
	button {
		flex: 1;
		padding: 10px;
		margin-left: 10px;
		font-size: 14px;
		font-weight: bold;
		background-color: #000;
		color: #fff;
		border: 0px;
		max-width: 150px;
		cursor: pointer;
	}
`;

function App() {
	const emailEditorRef = useRef(null);
	const [sheetID, setSheetID] = useState("");
	const [totalServerCount, setTotalServerCount] = useState(30);
	const [subject, setSubject] = useState("");
	const [sendInterval, setSendInterval] = useState(2.7);

	function sendEmails(data) {
		const url = "https://email.sendylo-stg.tk/send-bulk-emails"
		//const url = "/send-bulk-emails";
		const reqOptions = {
			spreadSheetId: sheetID,
			totalServerCount: totalServerCount,
			subject: subject,
			sendInterval: sendInterval,
			htmlEmail: data.html,
			emailText: "Please send all the files here"
		};
		axios.post(url, reqOptions).then(res => {
			console.log(res.data);
		});
	}

	const saveDesign = props => {
		emailEditorRef.current.editor.saveDesign(design => {
			console.log("saveDesign", design);
			alert("Design JSON has been logged in your developer console.");
		});
	};

	const exportHtml = () => {
		emailEditorRef.current.editor.exportHtml(data => {
			sendEmails(data);
		});
	};

	const onDesignLoad = data => {
		console.log("onDesignLoad", data);
	};

	const onLoad = () => {
		console.log("onLoad");

		emailEditorRef.current.editor.addEventListener("design:loaded", onDesignLoad);

		emailEditorRef.current.editor.loadDesign(sample);
	};

	const onReady = () => {
		// editor is ready
		console.log("onReady");
	};

	return (
		<Container>
			<Bar>
				<h1>Sendylo Email Marketing</h1>
				<button onClick={saveDesign}>Save Design</button>
				<button onClick={exportHtml}>Export HTML</button>
			</Bar>

			<div>
				<label htmlFor="sheetID">Sheet ID</label>
				<input name="sheetID" onChange={e => setSheetID(e.target.value)} />

				<label htmlFor="subject">Sujet de l'email</label>
				<input name="subject" onChange={e => setSubject(e.target.value)} />

				<label htmlFor="sendInterval">Interval entre envoie</label>
				<input
					type="number"
					step="0.5"
					min="0"
					max="10"
					value={sendInterval}
					onChange={e => setSendInterval(parseFloat(e.target.value))}
				/>

				<label htmlFor="totalServerCount">Nombre de serveurs Gmail</label>
				<input
					onKeyPress={event => {
						if (!/[0-9]/.test(event.key)) {
							event.preventDefault();
						}
					}}
					value={totalServerCount}
					name="totalServerCount"
					onChange={e => setTotalServerCount(parseInt(e.target.value))}
				/>
			</div>

			<React.StrictMode>
				<EmailEditor
					projectId={1071}
					ref={emailEditorRef}
					onLoad={onLoad}
					onReady={onReady}
				/>
			</React.StrictMode>
		</Container>
	);
}

export default App;
