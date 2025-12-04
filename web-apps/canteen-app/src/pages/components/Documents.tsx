import { useEffect, useState } from "react";
import { Button, List, ListItem, ListItemButton, ListItemText, Typography } from "@mui/material";
import { generateID } from "@phantom-chen/cloud77";

export function Documents(props: {
  documents: { id: string, title: string }[],
  getDocuments: () => void
}) {

  const { documents, getDocuments } = props;

  useEffect(() => {
    getDocuments();
  }, []);

  return (
    <div>
      <Typography variant="h6" component='div'>Documents</Typography>
      <Button onClick={(() => {
        console.log(generateID());
      })}>add document</Button>
      <List style={{width: '300px'}}>
        {
          documents.map((doc, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton component="a">
                <ListItemText primary={doc.title} />
              </ListItemButton>
            </ListItem>
          ))
        }
      </List>
    </div>
  );
}