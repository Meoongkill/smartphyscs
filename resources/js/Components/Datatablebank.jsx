import React from "react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";

export default function DataTablebank({data}) {
    // console.log(data)
    const handleEdit = (rowData) => {
        console.log("Edit row:", rowData);
    };

    const handleDelete = (rowData) => {
        console.log("Delete row:", rowData);
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="flex gap-2">
                <Button
                    variant="default"
                    size="sm"
                    className="bg-blue-800 hover:bg-blue-700"
                    onClick={() => handleEdit(rowData)}
                >
                    Edit
                </Button>
                <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(rowData)}
                >
                    Delete
                </Button>
            </div>
        );
    };



    return (
        <Card>
            <CardHeader>
                <CardTitle>Data Bank Soal</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>No</TableHead>
                            <TableHead>Dimensi</TableHead>
                            <TableHead>Soal</TableHead>
                            <TableHead className="text-center">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data && data.length > 0 ? (
                            data.map((item, index) => (
                                <TableRow key={item.id || index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{item.dimensi}</TableCell>
                                    <TableCell>{item.soal}</TableCell>
                                    <TableCell className="text-center">
                                        {actionBodyTemplate(item)}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center">
                                    No data found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
