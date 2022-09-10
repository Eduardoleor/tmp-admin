import React, { useState } from "react";
import { read, utils, writeFile } from "xlsx";

const Main = () => {
  const [movies, setMovies] = useState<any>([]);
  const [selectedFile, setSelectedFile] = useState<any>(null);

  const handleImport = ($event: any) => {
    const files = $event.target.files;
    setSelectedFile(files);
    if (files.length) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event: any) => {
        const wb = read(event.target.result);
        const sheets = wb.SheetNames;

        if (sheets.length) {
          const rows: any = utils.sheet_to_json(wb.Sheets[sheets[0]]);
          setMovies(rows);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleExport = () => {
    const headings = [
      [
        "PartNumber",
        "BuildSequence",
        "BalloonNumber",
        "Qty",
        "PONo",
        "VendorNo",
        "PackingDiskNo",
        "Linea",
      ],
    ];
    const wb = utils.book_new();
    const ws = utils.json_to_sheet([]);
    utils.sheet_add_aoa(ws, headings);
    utils.sheet_add_json(ws, movies, { origin: "A2", skipHeader: true });
    utils.book_append_sheet(wb, ws, "Report");
    writeFile(wb, "Movie Report.xlsx");
  };

  const handleUploadToBD = () => {
    const formData = new FormData();
    formData.append("blob", selectedFile[0], "test");

    fetch("/api/save-report", {
      method: "POST",
      body: formData,
    })
      .then((r) => r.json())
      .then((data) => {
        alert("File uploaded successfully");
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <>
      <div className="row mb-2 mt-5">
        <div className="col-sm-6 offset-3">
          <div className="row">
            <div className="col-md-6">
              <div className="input-group">
                <div className="custom-file">
                  <input
                    type="file"
                    name="file"
                    className="custom-file-input"
                    id="inputGroupFile"
                    required
                    onChange={handleImport}
                    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                  />
                  <label className="custom-file-label" htmlFor="inputGroupFile">
                    Choose file
                  </label>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <button
                onClick={handleExport}
                className="btn btn-primary float-right"
              >
                Export <i className="fa fa-download"></i>
              </button>
            </div>
            <div className="col-md-6">
              <button
                onClick={handleUploadToBD}
                className="btn btn-primary float-right"
              >
                Upload to BD <i className="fa fa-download"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-sm-6 offset-3">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">PartNumber</th>
                <th scope="col">BuildSequence</th>
                <th scope="col">BalloonNumber</th>
                <th scope="col">Qty</th>
                <th scope="col">PONo</th>
                <th scope="col">VendorNo</th>
                <th scope="col">PackingDiskNo</th>
                <th scope="col">Linea</th>
              </tr>
            </thead>
            <tbody>
              {movies.length ? (
                movies.map((movie: any, index: number) => {
                  return (
                    <tr key={index}>
                      <th scope="row">{index + 1}</th>
                      <td>{movie.PartNumber}</td>
                      <td>{movie.BuildSequence}</td>
                      <td>{movie.BalloonNumber}</td>
                      <td>{movie.Qty}</td>
                      <td>{movie.PONo}</td>
                      <td>{movie.VendorNo}</td>
                      <td>{movie.PackingDiskNo}</td>
                      <td>{movie.Linea}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td>No Movies Found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Main;
