      function QueryTheBoundsPoint(){
          var ftimeArr = {}
          var ftimeList = { '0': 0,'1': 0,'2': 0,'3': 0,'4': 0,'5': 0,'6': 0,'7': 0,'8': 0,'9': 0,
                            '10': 0,'11': 0,'12': 0,'13': 0,'14': 0,'15': 0,'16': 0,'17': 0,'18': 0,'19': 0,
                            '20': 0,'21': 0,'22': 0,'23': 0}
          var genderPie = {'男':0, '女':0}
          var ageTypePie = {'20_49':0, '50up':0}
          var ageStructure = {'20_29':'20_49', '30_39':'20_49', '40_49':'20_49', '50_59':'50up', '60up':'50up'}
          var v_list = {}
          var condition = getCondition();

          for ( x_y in x_yIndex){
            p_lat = parseFloat(x_y.split("_")[1])
            p_lng = parseFloat(x_y.split("_")[0])
            if (p_lat>=theSouthWest.lat && p_lat<=theNorthEast.lat && p_lng>=theSouthWest.lng && p_lng<=theNorthEast.lng ){
              points = x_yIndex[x_y]
              for ( p_index in points){
                p = points[p_index]
                if(p['ftime'] == indexFtime){
                  if(((condition.gender == "") ||(condition.gender == p['gender'])) && ((condition.age == "") || (condition.age == ageStructure[p['age_type']])) ){
                    ageTypePie[ageStructure[p['age_type']]]+=p['avg_cnt']
                    genderPie[p['gender']]+=p['avg_cnt']
                  }
                }
                if(((condition.gender == "") ||(condition.gender == p['gender'])) && ((condition.age == "") || (condition.age == ageStructure[p['age_type']])) ){
                  ftimeList[p['ftime']]+=p['avg_cnt']
                }
              }
            }
          }

          // for ( x_y in x_yVillages){
          //   p_lat = parseFloat(x_y.split("_")[1])
          //   p_lng = parseFloat(x_y.split("_")[0])
          //   if (p_lat>=theSouthWest.lat && p_lat<=theNorthEast.lat && p_lng>=theSouthWest.lng && p_lng<=theNorthEast.lng ){
          //     villages = x_yVillages[x_y]
          //     for ( p_village in villages){
          //       v = villages[p_village]
          //       if(v['ftime'] == indexFtime){
          //         if(v['local_name'] in v_list){
          //           v_list[v['local_name']]+=v['ccnt']
          //         }else{
          //           v_list[v['local_name']]=v['ccnt']
          //         }
          //       }
          //     }
          //   }
          // }

              

          var lineDataOfFtime = []
          for(var i=0; i<24; i++){
            lineDataOfFtime.push(ftimeList[i.toString()])
          }

          pieDataOfAge = [ageTypePie['20_49'] , ageTypePie['50up']]// , ageTypePie['40_49'] , ageTypePie['50_59'] , ageTypePie['60up']]

          pieDataOfGender = [genderPie['男'],genderPie['女']]
          window.theFigFtime.data.datasets[0].data=lineDataOfFtime
          window.theFigFtime.update()

          window.theFigAge.data.datasets[0].data=pieDataOfAge
          window.theFigAge.update()

          window.theFigGender.data.datasets[0].data=pieDataOfGender
          window.theFigGender.update()


          showTheLocal(v_list)
      }


      function showTheLocal(v_list){
        var total_num = 0;
        for( local in v_list){
          total_num+=parseInt(v_list[local])
        }

        var items = Object.keys(v_list).map(function(key) {
          return [key, v_list[key]];
        });

        items.sort(function(first, second) {
          return second[1] - first[1];
        });

        var otherNum = 0
        var tableBodyStr= ""
        var showItemNumber = 10
        for ( k in items){
          sortNumber = parseInt(k)+1
          if(sortNumber>showItemNumber){
            otherNum+=items[k][1]
          }else{
            thisPercent = (parseInt(items[k][1])*100/total_num).toFixed(1)
            strPercent = thisPercent+"%"
            tableBodyStr+="<tr> <th scope=\"row\"> #"+sortNumber+"</th><td>"+items[k][0]+"</td><td id='villageTD'>"+items[k][1]+"</td><td id='villageTD'>"+strPercent+"</td></tr>"
          }
        }
        if(otherNum>0){
          thisPercent = (otherNum*100/total_num).toFixed(1)
          strPercent = thisPercent+"%"
          tableBodyStr+="<tr> <th scope=\"row\"> #"+(showItemNumber+1)+"</th><td>其他</td><td id='villageTD'>"+otherNum+"</td><td id='villageTD'>"+strPercent+"</td></tr>"
        }
        $("#villageTable").html(tableBodyStr)
        // var otherNum = 0
        // items.map( (i, v)=>{
        //   if(i<10){
        //     otherNum+=v[1]
        //   }else{
        //     console.log(v)
        //   }
        // });
        // console.log(otherNum)
      }


      function drawTheFigAge(){
          var configFigAge = {
            type: 'doughnut',
            data: {
              datasets: [{
                data: [1,1],
                backgroundColor: [
                  //window.chartColors.red,
                  //window.chartColors.orange,
                  window.chartColors.yellow,
                  //window.chartColors.green,
                  // window.chartColors.blue,
                  window.chartColors.grey
                ],
                label: '年齡層佔比'
              }],
              labels: ['20-49','50 up']//['20-29','30-39','40-49','50-59','60 up']
            },
            options: {
              responsive: true,
              legend: {
                position: 'left',
                labels: {
                  boxWidth:5,
                  fontSize: 13
                }
              },
              title: {
                display: true,
                text: '年齡層佔比',
                fontSize: 8
              },
              animation: {
                animateScale: true,
                animateRotate: true
              }
            }
          };

          var ctx_FigAge = document.getElementById('canvas_FigAge').getContext('2d');
          window.theFigAge = new Chart(ctx_FigAge, configFigAge);
      }


      function drawTheFigGender(){
          var configFigGender = {
            type: 'doughnut',
            data: {
              datasets: [{
                data: [1,1],
                backgroundColor: [
                  window.chartColors.blue,
                  window.chartColors.red
                ],
                label: '性別佔比'
              }],
              labels: ['男','女']
            },
            options: {
              responsive: true,
              legend: {
                position: 'left',
                labels: {
                  boxWidth: 15,
                  fontSize: 14
                }
              },
              title: {
                display: true,
                text: '性別佔比',
                fontSize: 10
              },
              animation: {
                animateScale: true,
                animateRotate: true
              }
            }
          };

          var ctx_FigGender = document.getElementById('canvas_FigGender').getContext('2d');
          window.theFigGender = new Chart(ctx_FigGender, configFigGender);
      }

      function drawTheFigTotal(){
          var timeFormat = 'HH:mm';
          var color = Chart.helpers.color;
          var dataFigTotal = {
            labels: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'],
            datasets: [{
              type: 'bar',
              label: '人次',
              backgroundColor: window.chartColors.green,
              data: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
              yAxisID: 'y-axis-1'
            }]
          };

          var configFigTotal = {
            type: 'bar',
            data: dataFigTotal,
            options: {
              responsive: true,
              title: {
                display: false,
                text: '族群人次及平均停留時間',
                fontSize: 10
              },
              tooltips: {
                mode: 'index',
                intersect: false
              },
              scales: {
                yAxes: [{
                  type: 'linear',
                  display: true,
                  position: 'left',
                  id: 'y-axis-1',
                  scaleLabel: {
                    display: false,
                  },
                  ticks: {
                            fontSize: 9
                        }
                }],
              },
              legend: {
                  display:false
              },
              onClick: chartClickEvent
            }
          }
          var ctx_FigTotal = document.getElementById('canvas_FigTotal').getContext('2d');
          window.theFigTotal = new Chart(ctx_FigTotal, configFigTotal);
          
      }



      function drawTheFigFtime(){
          var timeFormat = 'HH:mm';
          var color = Chart.helpers.color;
          var configFigFtime = {
            type: 'line',
            data: {
              labels: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'],
              datasets: [ {
                label: "人數",
                backgroundColor: color(window.chartColors.blue).alpha(0.5).rgbString(),
                borderColor: window.chartColors.blue,
                fill: false,
                data: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
              }]
            },
            options: {
              responsive: true,
              title: {
                display: true,
                text: '各時間點當下的人潮',
                fontSize: 10
              },
              tooltips: {
                mode: 'index',
                intersect: false
              },
              scales: {
                xAxes: [{
                  type: 'time',
                  time: {
                    parser: timeFormat,
                    tooltipFormat: 'HH:mm'
                  },
                  scaleLabel: {
                    display: false,
                    labelString: '活動時間'
                  },
                  ticks: {
                            fontSize: 9
                        }
                }],
                yAxes: [{
                  scaleLabel: {
                    display: false,
                  },
                  ticks: {
                            fontSize: 9
                        }
                }]
              },
              legend: {
                      display:false,
                      labels: {
                           fontSize: 9
                      }
                  }
            }
          };
          var ctx_FigFtime = document.getElementById('canvas_FigFtime').getContext('2d');
          window.theFigFtime = new Chart(ctx_FigFtime, configFigFtime);
      }

      function removeShades(){
        map.removeLayer(r)
        map.removeLayer(shades)
        r = map.editTools.startRectangle()
        shades.addTo(map);
        $("#villageTable").html("<th colspan=\"4\" style=\"text-align: center;\">請先選擇範圍</th>")
      }



      function setTheSelectedClock(ftimeIndex,f_index){
        console.log(ftimeIndex,f_index)
        var labelsSet = ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00']
        $("#selectedClock").html("【"+labelsSet[f_index]+"】")
        showDataInMap(ftimeIndex,f_index)
        indexFtime=f_index
        QueryTheBoundsPoint()
      }



      function chartClickEvent(event, array){
         newArr = array;
         if (event === 'undefined' || event == null) {return; }
         if (newArr === 'undefined' || newArr == null) {return; }
         if (newArr.length <= 0) {return; }
         var chartData = newArr[0]['_chart'].config.data;
         var idx = newArr[0]['_index'];
         var label = chartData.labels[idx];
         var value = chartData.datasets[0].data[idx];
         var series = chartData.datasets[0].label;
         setTheSelectedClock(ftimeIndex,idx)
      }


      function showDataInMap(thePointLogs, indexTime){
        thisPointLogs = thePointLogs[indexTime]
        showItemAll = []
        for( itemP in thisPointLogs ){
          xyArr = itemP.split("_")
          x = parseFloat(xyArr[0])
          y = parseFloat(xyArr[1])
          thisWeight = parseInt(thisPointLogs[itemP])
          itemSeeeet = {lat: y , lng: x , count:thisWeight}
          showItemAll.push(itemSeeeet)
        }
        var testData = {max : maxVal , data:showItemAll}

        heatmapLayer.setData(testData)
      }



      function autoLoadCSV(){
        log1 = './logs/'+eoe[0]
        Papa.parse(log1, {
          download: true,
          header: true,
          dynamicTyping: true,
          complete: function(results) {
            csv = [];
            if(results.meta.fields.indexOf("avg_cnt") == -1) {
              for(idx in results.data) {
                var row = results.data[idx];
                // csv.push(new google.maps.LatLng(row["lat"], row["lon"]))
              }
            } else {
              for(idx in results.data) {
                var row = results.data[idx];
                var x_y = row['x']+"_"+row['y']
                var ftime = row['ftime']

                if( ftime in ftimeIndex ){
                  if(x_y in ftimeIndex[ftime]){
                    ftimeIndex[ftime][x_y]+=parseInt(row['avg_cnt'], 10)
                  }else{
                    ftimeIndex[ftime][x_y]=parseInt(row['avg_cnt'], 10)
                  }
                }else{
                  ftimeIndex[ftime] = {}
                  ftimeIndex[ftime][x_y]=parseInt(row['avg_cnt'], 10)
                }

                if(x_y in x_yIndex){
                  x_yIndex[x_y].push(row)
                }else{
                  x_yIndex[x_y] = [row]
                }
              }
              var totalNum = []
              for(a in ftimeIndex){
                totalNum[a]=0
                for(b in ftimeIndex[a]){
                  maxVal=maxVal<ftimeIndex[a][b]?ftimeIndex[a][b]:maxVal
                  minVal=minVal>ftimeIndex[a][b]?ftimeIndex[a][b]:minVal
                  totalNum[a]+=ftimeIndex[a][b]
                }
              }

              window.theFigTotal.data.datasets[0].data=totalNum;
              window.theFigTotal.update()
              setTheSelectedClock(ftimeIndex, indexFtime );
              return;
            }

          }
        });
      }




      // function loadVillageData(){
      //   villageFiles= [eoe[1],eoe[2],eoe[3],eoe[4]]
      //   villageFiles.map((k)=>{
      //     Papa.parse('./logs/'+k, {
      //       download: true,
      //       header: true,
      //       dynamicTyping: true,
      //       complete: function(results) {
      //         csv = [];
      //         if(results.meta.fields.indexOf("ccnt") == -1) {
      //           for(idx in results.data) {
      //             var row = results.data[idx];
      //             // csv.push(new google.maps.LatLng(row["lat"], row["lon"]))
      //           }
      //         } else {
      //           for(idx in results.data) {
      //             var row = results.data[idx];
      //             var x_y = row['x']+"_"+row['y']
      //             var ftime = row['ftime']

      //             if(x_y in x_yVillages){
      //               x_yVillages[x_y].push(row)
      //             }else{
      //               x_yVillages[x_y] = [row]
      //             }
      //           }
      //           return;
      //         }
      //       }
      //     });
      //   });
      // }