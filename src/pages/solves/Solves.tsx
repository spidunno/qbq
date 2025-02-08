import {
	Box,
	Button,
	DialogActions,
	DialogContent,
	DialogTitle,
	Divider,
	IconButton,
	Link,
	Modal,
	ModalDialog,
	Sheet,
	Stack,
	Table,
	Typography,
} from "@mui/joy";
import { useAtomValue, useSetAtom } from "jotai";
import { DatabaseSolve, solvesDb, sortedSolvesAtom } from "../../state/storage";
import { formatTime } from "../../util/timeFormatting";
import { Icon } from "../../components/Icon";
import { useState } from "react";
import { askBeforeDeleteAtom } from "../../state/settings";
import { Link as RouterLink } from "react-router";

export default function Solves() {
	const solves = useAtomValue(solvesDb.values);

	return (
		<Box width={"100%"} height={"100%"} alignContent={solves.length === 0 ? "center" : "start"}>
			{solves.length === 0 ? (
				<Typography justifySelf={"center"} color="neutral" sx={{userSelect: "none"}}>Nothing here yet...</Typography>
			) : (
				<Table>
					{/* <thead>
					<th>Solve Time</th>
					<th>Scramble</th>
				</thead> */}
					<tbody>
						{solves
							.map((v, i) => [i, v] as const)
							.sort((a, b) => {
								return a[1].createdAt - b[1].createdAt;
							})
							.reverse()
							.map((v, i, _a) => (
								<SolveDisplay
									index={i}
									solvesArrIndex={v[0]}
									solve={v[1]}
									key={v[1].id}
								/>
							))}
					</tbody>
				</Table>
			)}
		</Box>
	);
}

function SolveDisplay({
	solve,
	index,
	solvesArrIndex,
}: {
	solve: DatabaseSolve;
	index: number;
	solvesArrIndex: number;
}) {
	const solves = useAtomValue(sortedSolvesAtom) || [];
	const setSolves = useSetAtom(solvesDb.set);
	const deleteSolve = useSetAtom(solvesDb.delete);
	const [deleteOpen, setDeleteOpen] = useState(false);
	const askBeforeDelete = useAtomValue(askBeforeDeleteAtom);

	return (
		<tr>
			<Sheet component="td">
				{" "}
				<Typography fontFamily={"Azeret Mono"} display={"inline"}>
					{solves.length - index}.
				</Typography>
				<Typography
					display="inline"
					fontWeight={"bold"}
					sx={(theme) => ({
						marginLeft: "16px",
						color: solve.dnf
							? `rgba(${theme.palette.danger.mainChannel} / 1)`
							: solve.plusTwo
							? `rgba(${theme.palette.warning.mainChannel} / 1)`
							: `rgba(${theme.palette.success.mainChannel} / 1)`,
					})}
				>
					{solve.dnf ? "DNF" : formatTime(solve.time)}
				</Typography>{" "}
			</Sheet>
			{/* <td style={{ width: "100%", textWrap: "nowrap", overflowX: "scroll" }}>
				{solve.scramble}
			</td> */}
			<Sheet component="td" sx={{ textAlign: "start" }}>
				<Stack direction="row" width="100%" justifyContent={"end"} gap="6px">
					<Button
						onClick={() => {
							let solve = solves[solvesArrIndex];
							solve = {
								...solve,
								plusTwo: !solves[solvesArrIndex].plusTwo,
								time:
									solves[solvesArrIndex].rawTime +
									(!solves[solvesArrIndex].plusTwo ? 2000 : 0),
							};
							setSolves(solve.id, solve);
						}}
						sx={(theme) => ({
							color: solve.plusTwo
								? `rgba(${theme.palette.warning.mainChannel} / 1)`
								: undefined,
						})}
						color={solve.plusTwo ? "warning" : "neutral"}
						variant="plain"
					>
						+2
					</Button>
					<Button
						onClick={() => {
							let solve = solves[solvesArrIndex];
							solve = {
								...solves[solvesArrIndex],
								dnf: !solves[solvesArrIndex].dnf,
							};
							setSolves(solve.id, solve);
						}}
						color={solve.dnf ? "danger" : "neutral"}
						sx={(theme) => ({
							color: solve.dnf
								? `rgba(${theme.palette.danger.mainChannel} / 1)`
								: undefined,
						})}
						variant="plain"
					>
						DNF
					</Button>
					<IconButton
						onClick={() => {
							if (askBeforeDelete) {
								setDeleteOpen(true);
							} else {
								const solve = solves[solvesArrIndex]
								deleteSolve(solve.id);
							}
						}}
						color="danger"
						variant="soft"
					>
						<Icon icon="close" />
					</IconButton>
				</Stack>
			</Sheet>
			<Modal
				open={deleteOpen}
				onClose={() => {
					setDeleteOpen(false);
				}}
			>
				<ModalDialog variant="outlined" role="alertdialog">
					<DialogTitle sx={{ display: "block" }}>
						Delete this solve?
						{/* <br/> */}
						<Typography level="body-xs">
							<Link
								to="/settings/other#ask-before-delete"
								underline="always"
								color="neutral"
								component={RouterLink}
							>
								Don't want this? You can disable this popup here.
							</Link>
						</Typography>
					</DialogTitle>
					<Divider />
					<DialogContent>
						Are you sure you want to delete this solve? This action is
						irreversible!
					</DialogContent>
					<DialogActions>
						<Button
							variant="solid"
							color="danger"
							onClick={() => {
								const solve = solves[solvesArrIndex];
								deleteSolve(solve.id);
								setDeleteOpen(false);
							}}
						>
							Delete solve
						</Button>
						<Button
							variant="plain"
							color="neutral"
							onClick={() => setDeleteOpen(false)}
						>
							Cancel
						</Button>
					</DialogActions>
				</ModalDialog>
			</Modal>
		</tr>
	);
}
