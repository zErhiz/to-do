import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { Trash } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
interface Note {
  id: number;
  userId: string;
  title: string;
  description: string;
  status: string;
}
export default function Notes() {
  const user = useUser().user;
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDone, setShowDone] = useState(false);

  const handleSearchChange = (event: any) => {
    setSearchTerm(event.target.value);
  };

  const handleCheckboxClick = () => {
    setShowDone(!showDone);
  };

  const filteredNotes = notes.filter((note) => {
    const isMatchingTitle = note.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const isMatchingStatus = showDone
      ? note.status === "done"
      : note.status === "to-do";
    return isMatchingTitle && isMatchingStatus;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedNotes = JSON.parse(localStorage.getItem("notes") || "[]");
      setNotes(storedNotes);
    }
  }, []);

  const { ref, inView } = useInView({
    triggerOnce: true,
  });

  const variants = {
    hidden: { scale: 0.9, opacity: 0 },
    show: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 1,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      className="flex h-full justify-center items-center min-h-screen flex-col"
    >
      <div className="flex flex-col items-center gap-0.5 ">
        {" "}
        <Image
          src={user?.imageUrl ?? ""}
          alt="Notes"
          width={100}
          className="rounded-full"
          height={100}
        />
        <h2 className="text-2xl text-white font-bold"> {user?.fullName}</h2>
      </div>
      <div className="flex flex-col items-center justify-center gap-4">
        <CreateNote setNote={setNotes} userIdNotes={user?.id || "0"} />
        <div className="flex  flex-col md:flex-row justify-center items-center gap-4">
          <Label>Search</Label>
          <Input value={searchTerm} onChange={handleSearchChange} />
          <Label>Done</Label>
          <Checkbox checked={showDone} onClick={handleCheckboxClick} />
        </div>

        <NotesList notes={filteredNotes} setNote={setNotes} />
      </div>
    </motion.div>
  );
}
interface CreateNoteProps {
  userIdNotes: string;
  setNote: React.Dispatch<React.SetStateAction<Note[]>>;
}
const CreateNote: React.FC<CreateNoteProps> = ({ userIdNotes, setNote }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [IsOpen, setIsOpen] = useState(false);
  const handleTitleChange = (event: any) => {
    setTitle(event.target.value);
  };

  const handleDescriptionChange = (event: any) => {
    setDescription(event.target.value);
  };

  const createNote = () => {
    const notes: Note[] = JSON.parse(localStorage.getItem("notes") || "[]");
    const id: number = Date.now();
    const userId: string = userIdNotes;
    const status: string = "to-do";
    const newNote: Note = { id, userId, title, description, status };
    const updatedNotes: Note[] = [...notes, newNote];

    localStorage.setItem("notes", JSON.stringify(updatedNotes));
    setTitle("");
    setDescription("");
    setIsOpen(false);
    setNote(updatedNotes);
  };
  const cancelNote = () => {
    setIsOpen(false);
    setTitle("");
    setDescription("");
  };
  return (
    <>
      <Dialog onOpenChange={setIsOpen} open={IsOpen}>
        <Button className="bg-blue-800">
          {" "}
          <DialogTrigger>Create note</DialogTrigger>
        </Button>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a New Note</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <Label>Title</Label>
            <Input
              type="text"
              placeholder="My first note"
              value={title}
              onChange={handleTitleChange}
            />
            <Label>Description</Label>
            <Textarea
              placeholder="this is my first note"
              value={description}
              onChange={handleDescriptionChange}
            />
          </DialogDescription>
          <DialogFooter>
            <Button className="bg-red-800" onClick={cancelNote}>
              Cancel
            </Button>
            <Button
              className="bg-blue-800"
              disabled={title === "" || description === ""}
              onClick={createNote}
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

interface NotesListProps {
  notes: Note[];
  setNote: React.Dispatch<React.SetStateAction<Note[]>>;
}

const NotesList: React.FC<NotesListProps> = ({ notes, setNote }) => {
  const user = useUser().user;

  const filteredNotes = notes.filter((note) => note.userId === user?.id);

  const changeNoteStatus = (noteId: number, newStatus: string): void => {
    const notes: Note[] = JSON.parse(localStorage.getItem("notes") || "[]");
    const updatedNotes: Note[] = notes.map((note) =>
      note.id === noteId ? { ...note, status: newStatus } : note
    );

    localStorage.setItem("notes", JSON.stringify(updatedNotes));
    setNote(updatedNotes);
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      {filteredNotes.length === 0 ? (
        <p>No notes available.</p>
      ) : (
        filteredNotes.map((note) => (
          <Card key={note.id}>
            <div className="flex justify-between p-0.5 items-center">
              <AlertNote noteId={note.id} setNote={setNote} />
              <Checkbox
                checked={note.status === "done"}
                onClick={() => {
                  const newStatus = note.status === "done" ? "to-do" : "done";
                  changeNoteStatus(note.id, newStatus);
                }}
              />
            </div>
            <CardHeader className="p-2">
              <CardTitle>{note.title}</CardTitle>
              <CardDescription>{note.description}</CardDescription>
            </CardHeader>
          </Card>
        ))
      )}
    </div>
  );
};

interface AlertNoteProps {
  noteId: number;
  setNote: React.Dispatch<React.SetStateAction<Note[]>>;
}

const AlertNote: React.FC<AlertNoteProps> = ({ noteId, setNote }) => {
  const deleteNote = (noteId: number): void => {
    const notes: Note[] = JSON.parse(localStorage.getItem("notes") || "[]");
    const updatedNotes: Note[] = notes.filter((note) => note.id !== noteId);

    localStorage.setItem("notes", JSON.stringify(updatedNotes));
    setNote(updatedNotes);
  };
  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger>
          <Trash className="text-red-500" />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás absolutamente seguro/a?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no puede deshacerse. Esto eliminará permanentemente la
              nota.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteNote(noteId)}
              className="bg-red-500 hover:bg-red-600"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
